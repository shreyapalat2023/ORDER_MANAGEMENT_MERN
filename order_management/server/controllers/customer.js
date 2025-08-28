import Customer from "../models/customer.model.js"
export const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, state, city, gstn, status } = req.body;

    // Validation
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

    // Check for existing customer (optional but recommended)
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }, { name: new RegExp(`^${name}$`, "i") }]
    });

    if (existingCustomer) {
      console.log("Customer with this name, email, or phone already exists");

      return res.status(400).json({ error: "Customer with this name, email, or phone already exists" });
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

    // console.log("Received supplierId:", customerId);
    // console.log("Received body:", updatedData);

    // Basic validation
    const requiredFields = ['name', 'email', 'phone', 'address', 'gstn', 'status'];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }


    // ... other validation logic (email, phone, etc.)

    const customer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
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