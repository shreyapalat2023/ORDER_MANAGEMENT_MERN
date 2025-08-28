import Supplier from "../models/supplier.model.js";
export const create = async (req, res) => {
    try {
        const { name, email, phone, address, state, city, gstn, status } = req.body;

        //validation
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "email is required" });
        }
        if (!phone) {
            return res.status(400).json({ error: "Phone is required" });
        }
        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }
        if (!gstn) {
            return res.status(400).json({ error: "Name is required" });
        }

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

        //save to DB
        const supplier = new Supplier({
            name,
            email,
            phone,
            address,
            state,
            city,
            gstn,
            status
        });
        await supplier.save();
        res.status(201).json({ messsage: "Customer added successfully", supplier });

    } catch (error) {
        console.error("Error adding supplier", error);
        res.status(500).json({ erro: "Server Error" })
    }
}

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

        // Basic validation
        const requiredFields = ['name', 'email', 'phone', 'address', 'gstn', 'status'];
        for (const field of requiredFields) {
            if (!updatedData[field]) {
                return res.status(400).json({ error: `${field} is required.` });
            }
        }


        // ... other validation logic (email, phone, etc.)

        const supplier = await Supplier.findByIdAndUpdate(supplierId, updatedData, { new: true });

        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.status(200).json(supplier);
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