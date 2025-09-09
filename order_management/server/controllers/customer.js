import Customer from "../models/customer.model.js"
export const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, state, city, gstn, status } = req.body;

    // Basic validation (as you already had)
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    if (!address) return res.status(400).json({ error: "Address is required" });
    if (!gstn) return res.status(400).json({ error: "GSTN is required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number. Must be 10 digits." });
    }

    const gstnRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstnRegex.test(gstn)) {
      return res.status(400).json({ error: "Invalid GSTN format." });
    }

    // 🔑 Check for existing customer with same email, phone, or GSTN
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }, { gstn }]
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return res.status(400).json({ error: `Customer with email ${email} already exists` });
      }
      if (existingCustomer.phone === phone) {
        return res.status(400).json({ error: `Customer with phone ${phone} already exists` });
      }
      if (existingCustomer.gstn === gstn) {
        return res.status(400).json({ error: `Customer with GSTN ${gstn} already exists` });
      }
    }

    // Save to DB
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      state,
      city,
      gstn,
      status,
    });

    await customer.save();

    res.status(201).json({ message: "Customer added successfully", customer });

  } catch (error) {
    console.error("Error adding customer", error);
    res.status(500).json({ error: "Server Error" });
  }
};



//list of customers

export const list = async (req, res) => {
  try {

    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.status(200).json(customers);

  } catch (error) {
    console.error("Failed to fetch customers", error);
    res.status(500).res.json({ error: "Failed to fetch customers." })
  }
}

// PUT /api/customers/:customerId
export const update = async (req, res) => {
  try {
    const updatedData = req.body;
    const { customerId } = req.params;

    // Required fields check
    const requiredFields = ["name", "email", "phone", "address", "gstn", "status"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(updatedData.phone)) {
      return res.status(400).json({ error: "Invalid phone number. Must be 10 digits." });
    }

    // Validate GSTN format
    const gstnRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstnRegex.test(updatedData.gstn)) {
      return res.status(400).json({ error: "Invalid GSTN format" });
    }

    // 🔑 Check for uniqueness (exclude current customerId)
    const existingCustomer = await Customer.findOne({
      _id: { $ne: customerId }, // exclude current record
      $or: [
        { email: updatedData.email },
        { phone: updatedData.phone },
        { gstn: updatedData.gstn },
      ],
    });

    if (existingCustomer) {
      if (existingCustomer.email === updatedData.email) {
        return res.status(400).json({ error: `Customer with email ${updatedData.email} already exists` });
      }
      if (existingCustomer.phone === updatedData.phone) {
        return res.status(400).json({ error: `Customer with phone ${updatedData.phone} already exists` });
      }
      if (existingCustomer.gstn === updatedData.gstn) {
        return res.status(400).json({ error: `Customer with GSTN ${updatedData.gstn} already exists` });
      }
    }

    // Update if all validations pass
    const customer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


export const remove = async (req, res) => {
  try {
    const removed = await Customer.findByIdAndDelete(req.params.customerId);
    res.json(removed);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
}