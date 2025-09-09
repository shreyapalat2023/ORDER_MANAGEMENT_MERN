import CustomerPO from "../models/customerPo.model.js";

export const create = async (req, res) => {
  try {
    const { poNumber, customer, date, status, items } = req.body;

    // Validation
    if (!poNumber || !customer || !date || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Step 1: Check for duplicate poNumber
    const existingPO = await CustomerPO.findOne({ poNumber });
    if (existingPO) {
      return res.status(400).json({ error: "PO Number must be unique" });
    }

    // ✅ Step 2: Calculate total amount
    const totalAmount = items?.reduce((total, item) => {
      return total + (parseFloat(item.salesPrice) || 0);
    }, 0);

    // ✅ Step 3: Create new instance
    const customerPo = new CustomerPO({
      poNumber,
      customer,
      date,
      status,
      items,
      totalAmount,
    });

    // ✅ Step 4: Save it
    const savedCustomerPo = await customerPo.save();

    // ✅ Step 5: Populate relations
    const populatedCustomerPo = await CustomerPO.findById(savedCustomerPo._id)
      .populate("customer", "name")
      .populate("items.item", "name");

    res.status(201).json({
      message: "CustomerPO added successfully",
      customerPo: populatedCustomerPo,
    });
  } catch (error) {
    console.error(error);

    // ✅ Handle duplicate key error (from MongoDB unique index)
    if (error.code === 11000 && error.keyPattern?.poNumber) {
      return res.status(400).json({ error: "PO Number already exists" });
    }

    res.status(500).json({ error: "Server Error" });
  }
};


//list

export const list = async (req, res) => {
    try {

        const custpmerPos = await CustomerPO.find({}).sort({ createdAt: -1 }).populate("customer", "name").populate("items.item","name");
        if (!custpmerPos) res.status(400).json({ error: "customerPo not found" })
        res.json(custpmerPos)

    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "server Error" })
    }
}

//update 
export const update = async (req, res) => {
  try {
    const { poNumber, customer, date, status, items } = req.body;
    const { id } = req.params;
    console.log("Received ID:", id);

    // Validation
    if (!poNumber || !customer || !date || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check if poNumber exists for another record
    const existingPO = await CustomerPO.findOne({ poNumber, _id: { $ne: id } });
    if (existingPO) {
      return res.status(400).json({ error: "PO Number must be unique" });
    }

    // ✅ Recalculate total amount
    const totalAmount = items?.reduce((total, item) => {
      return total + (parseFloat(item.salesPrice) || 0);
    }, 0);

    // ✅ Update document
    const updatedPO = await CustomerPO.findByIdAndUpdate(
      id,
      { poNumber, customer, date, status, items, totalAmount },
      { new: true }
    )
      .populate("customer", "name")
      .populate("items.item", "name");

    if (!updatedPO) {
      return res.status(404).json({ error: "Customer PO not found" });
    }

    res.status(200).json({ message: "Updated Successfully", customerPo: updatedPO });
  } catch (error) {
    console.error(error);

    // ✅ Handle duplicate key error (if schema has unique: true)
    if (error.code === 11000 && error.keyPattern?.poNumber) {
      return res.status(400).json({ error: "PO Number already exists" });
    }

    res.status(500).json({ error: "Server Error" });
  }
};



//remove

export const remove = async (req, res) => {
    try {
        const removed = await CustomerPO.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message: "CustomerPO deleted successfully",
            removed,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "server Error" })
    }

}

export const getCustomerPOItems = async (req, res) => {
  try {
    const customerPO = await CustomerPO.findById(req.params.id).populate("items.item");
    if (!customerPO) {
      return res.status(404).json({ message: "Customer PO not found" });
    }

    const items = customerPO.items.map(i => ({
      _id: i.item._id,
      name: i.item.name,
      qty: i.qty,
      unitCost: i.unitCost,
      tax: i.tax,
      salesPrice: i.salesPrice,
    }));

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
