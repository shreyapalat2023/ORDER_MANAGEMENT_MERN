import CustomerPO from "../models/customerPo.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";

export const getProfitLoss = async (req, res) => {
  try {
    const { customer, cpo, po, fromDate, toDate } = req.body;

    // --- Fetch Customer PO ---
    const cpoDoc = await CustomerPO.findOne({
      _id: cpo,
      customer,
      ...(fromDate && toDate
        ? { date: { $gte: new Date(fromDate), $lte: new Date(toDate) } }
        : {}),
    })
      .populate("items.item")
      .lean();

    if (!cpoDoc) {
      return res.status(404).json({ message: "Customer PO not found" });
    }

    // --- Fetch Purchase Order ---
    const poDoc = await PurchaseOrder.findOne({
      _id: po,
      customer,
    })
      .populate("items.item")
      .lean();

    if (!poDoc) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    // --- Customer PO Details ---
    const customerPoDetails = cpoDoc.items.map((it) => ({
      item: it.item,
      qty: it.qty,
      price: it.salesPrice,
    }));
    const cpoAmount = customerPoDetails.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    // --- Purchase Order Details ---
    const purchaseOrderDetails = poDoc.items.map((it) => ({
      item: it.item,
      qty: it.qty,
      purchasePrice: it.purchasePrice,
    }));
    const itemCost = purchaseOrderDetails.reduce(
      (sum, i) => sum + i.qty * i.purchasePrice,
      0
    );

    // --- Remaining Purchase Order ---
    const remainingPurchaseOrder = poDoc.items.map((poItem) => {
      const cpoItem = cpoDoc.items.find(
        (ci) => ci.item._id.toString() === poItem.item._id.toString()
      );
      const remainingQty = (cpoItem?.qty || 0) - poItem.qty;
      return {
        item: poItem.item,
        qty: remainingQty > 0 ? remainingQty : 0,
        price: poItem.purchasePrice,
      };
    });

    // --- Profit / Loss ---
    const profitLoss = cpoAmount - itemCost;

    res.json({
      customerPoDetails,
      purchaseOrderDetails,
      remainingPurchaseOrder,
      cpoAmount,
      itemCost,
      profitLoss,
    });
  } catch (err) {
    console.error("Error in /dashboard/profitloss:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
