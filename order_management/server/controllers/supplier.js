import Supplier from "../models/supplier.model.js";
export const create = async (req, res) => {
  try {
    const { name, email, phone, address, state, city, gstn, status } = req.body;

    // Required field checks
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    if (!address) return res.status(400).json({ error: "Address is required" });
    if (!gstn) return res.status(400).json({ error: "GSTN is required" });

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Phone validation (must be 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number. Must be 10 digits." });
    }

    // GSTN validation (15 character alphanumeric format)
    const gstnRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstnRegex.test(gstn)) {
      return res.status(400).json({ error: "Invalid GSTN format." });
    }

    // 🔑 Check for duplicates (email, phone, gstn)
    const existingSupplier = await Supplier.findOne({
      $or: [{ email }, { phone }, { gstn }],
    });

    if (existingSupplier) {
      if (existingSupplier.email === email) {
        return res.status(400).json({ error: `Supplier with email ${email} already exists` });
      }
      if (existingSupplier.phone === phone) {
        return res.status(400).json({ error: `Supplier with phone ${phone} already exists` });
      }
      if (existingSupplier.gstn === gstn) {
        return res.status(400).json({ error: `Supplier with GSTN ${gstn} already exists` });
      }
    }

    // Save supplier
    const supplier = new Supplier({
      name,
      email,
      phone,
      address,
      state,
      city,
      gstn,
      status,
    });

    await supplier.save();

    res.status(201).json({ message: "Supplier added successfully", supplier });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


//list suppliers

export const list = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error listing suppliers");
        res.status(500).json({ error: "Server Error" })
    }
}

//update suppliers 
export const update = async (req, res) => {
  try {
    const updatedData = req.body;
    const { supplierId } = req.params;

    console.log("Received supplierId:", supplierId);
    console.log("Received body:", updatedData);

    // Required fields validation
    const requiredFields = ["name", "email", "phone", "address", "gstn", "status"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Phone validation (must be 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(updatedData.phone)) {
      return res.status(400).json({ error: "Invalid phone number. Must be 10 digits." });
    }

    // GSTN validation (15 character alphanumeric format)
    const gstnRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstnRegex.test(updatedData.gstn)) {
      return res.status(400).json({ error: "Invalid GSTN format." });
    }

    // 🔑 Check for duplicates (excluding the current supplier)
    const existingSupplier = await Supplier.findOne({
      $or: [
        { email: updatedData.email },
        { phone: updatedData.phone },
        { gstn: updatedData.gstn },
      ],
      _id: { $ne: supplierId }, // exclude the current supplier
    });

    if (existingSupplier) {
      if (existingSupplier.email === updatedData.email) {
        return res.status(400).json({ error: `Supplier with email ${updatedData.email} already exists` });
      }
      if (existingSupplier.phone === updatedData.phone) {
        return res.status(400).json({ error: `Supplier with phone ${updatedData.phone} already exists` });
      }
      if (existingSupplier.gstn === updatedData.gstn) {
        return res.status(400).json({ error: `Supplier with GSTN ${updatedData.gstn} already exists` });
      }
    }

    // Update supplier
    const supplier = await Supplier.findByIdAndUpdate(supplierId, updatedData, { new: true });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


//remove supplier

export const remove = async (req, res) => {
    try {
        const removed = await Supplier.findByIdAndDelete(req.params.supplierId);
        res.status(200).json(removed)
    } catch (error) {
        console.error("Error removing supplier")
        res.status(500).json(error.message)
    }
}