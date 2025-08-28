
import PurchaseOrder from "../models/purchaseOrder.model.js"
export const create = async (req, res) => {
  try {
    const { customer, poNumber, customerPO, date, status, items } = req.body

    //validation
    if (!customer || !poNumber || !customerPO || !date || !status) {
      res.status(400).json({ error: "All fields are required" })
    }
    const purchaseOrder = new PurchaseOrder({
      customer,
      poNumber,
      customerPO,
      date,
      status,
      items
    })

    const savedPurchaseOrder = await purchaseOrder.save();

    // Step 3: Populate
    const populatedPurchaseOrder = await PurchaseOrder.findById(savedPurchaseOrder._id).populate("customer", "name").populate("customerPO", "poNumber").populate("items.item","name");

    res.status(201).json({
      message: "CustomerPO added successfully",
      purchaseOrder: populatedPurchaseOrder,
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" })
  }
}

//list
export const list = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({})
      .populate("customer", "name")
      .populate("customerPO", "poNumber")
      .populate("items.item","name");

    if (!purchaseOrders || purchaseOrders.length === 0) {
      return res.status(404).json({ error: "Order list not found" });
    }

    res.status(200).json({
      message: "Order list fetched successfully",
      data: purchaseOrders
    });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

//update
export const update = async (req, res) => {
  try {
    const updatedData = req.body;

    // ✅ Basic validation before updating
    const requiredFields = ["customer", "poNumber", "customerPO", "date", "status"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // ✅ Make sure we use lowercase "id"
    const purchaseOrder = await PurchaseOrder.findById(req.params.Id);
    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }

    // ✅ Update fields
    purchaseOrder.customer = updatedData.customer;
    purchaseOrder.poNumber = updatedData.poNumber;
    purchaseOrder.customerPO = updatedData.customerPO;
    purchaseOrder.date = updatedData.date;
    purchaseOrder.status = updatedData.status;

    // ✅ Replace items if provided
    if (updatedData.items && Array.isArray(updatedData.items)) {
      purchaseOrder.items = updatedData.items.map(item => ({
        item: item.item,
        qty: item.qty,
        unitCost: item.unitCost,
        tax: item.tax,
        purchasePrice: item.purchasePrice,
        invoiceNo: item.invoiceNo,
        invoiceDate: item.invoiceDate,
      }));

      // 🔑 Force Mongoose to detect modification
      purchaseOrder.markModified("items");
    }

    // ✅ Recalculate totalPurchaseAmount
    purchaseOrder.totalPurchaseAmount = purchaseOrder.items.reduce(
      (sum, item) => sum + (item.purchasePrice || 0),
      0
    );

    // ✅ Save changes
    const updatedOrder = await purchaseOrder.save();

    res.json({
      message: "Purchase Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating purchase order:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



export const remove = async (req, res) => {
  try {
    const removed = await PurchaseOrder.findByIdAndDelete(req.params.Id);
    res.status(200).json({ message: "purchase order removed", data: removed })
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Server Error" });
  }
}
//updateItem

export const updateItem = async (req, res) => {
  try {

    const { Id, itemId } = req.params;
    const updatedItemData = req.body;

    //Find the purchase order

    const purchaseOrder = await PurchaseOrder.findById(Id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    //Find the item subdocument
    const item = purchaseOrder.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in this Purchase Order" });
    }
    //update item fields
    Object.keys(updatedItemData).forEach((key) => {
      item[key] = updatedItemData[key];
    })

    // Recalculate total purchase amount
    purchaseOrder.totalPurchaseAmount = purchaseOrder.items.reduce(
      (sum, it) => sum + (it.purchasePrice || 0),
      0
    );

    await purchaseOrder.save();

  } catch (error) {
    console.error("Error updating purchase order item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

//getItem

export const getItem = async (req, res) => {
  try {
    const { Id, itemId } = req.params;
    const purchaseOrder = await PurchaseOrder.findById(Id).populate("items.item","name");
    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    const item = purchaseOrder.items.item.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in this Purchase Order" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error Getting Item", error);
    res.status(500).json({ error: "Server Error" })
  }
}


