// controllers/itemController.js
import Item from "../models/item.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";

export const getItemUtilization = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1. Fetch item with supplier populated
    const item = await Item.findById(itemId).populate("supplier", "name");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 2. Stock info from Item schema
    const stock = item.stock.map(s => ({
      date: s.date,
      qty: s.quantity,
      price: s.price,
      unit: item.unit || "Pic"
    }));

    const totalPurchased = stock.reduce((sum, s) => sum + (s.qty || 0), 0);

    // 3. Sales/Utilization info from Purchase Orders
    const purchaseOrders = await PurchaseOrder.find({ "items.item": itemId })
      .populate("customerPO", "poNumber date")
      .lean();

    const sales = [];
    purchaseOrders.forEach(po => {
      po.items.forEach(it => {
        if (String(it.item) === String(itemId)) {
          sales.push({
            customerPO: po.customerPO?.poNumber || "N/A",
            date: po.date,
            qty: it.qty,
            salesPrice: it.purchasePrice || 0 // adjust if you store sales price separately
          });
        }
      });
    });

    const totalSold = sales.reduce((sum, s) => sum + (s.qty || 0), 0);

    // 4. Calculate balance
    const balance = totalPurchased - totalSold;
    const oversold = balance < 0;

    // 5. Response
    res.json({
      message: "Item utilization fetched successfully",
      item: {
        id: item._id,
        name: item.name,
        category: item.category,
        brand: item.brand,
      },
      utilization: {
        totalPurchased,
        totalSold,
        balance: oversold ? 0 : balance,
        oversold,
      },
      purchases: stock.map(s => ({
        purchaseOrder: "N/A", // can be linked later if needed
        qty: s.qty,
        tax: 0,
        purchasePrice: s.price,
        date: s.date,
      })),
      sales,
    });
  } catch (error) {
    console.error("Error fetching item utilization:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
