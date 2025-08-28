import CustomerPO from "../models/customerPo.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import mongoose from "mongoose";

export const getProfitLoss = async (req, res) => {
  try {
    const { customer, cpo, po, fromDate, toDate } = req.query;

    // --- Filters ---
    const cpoFilter = {};
    if (customer) cpoFilter.customer = new mongoose.Types.ObjectId(customer);
    if (cpo) cpoFilter._id = new mongoose.Types.ObjectId(cpo);
    if (fromDate && toDate) {
      cpoFilter.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    const poFilter = {};
    if (po) poFilter._id = new mongoose.Types.ObjectId(po);
    if (cpo) poFilter.customerPO = new mongoose.Types.ObjectId(cpo);
    if (fromDate && toDate) {
      poFilter.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    // --- Fetch Customer POs ---
    const customerPOs = await CustomerPO.find(cpoFilter)
      .populate("customer", "name")
      .lean();

    let customerPoDetails = [];
    let cpoAmount = 0;

    customerPOs.forEach(cpoDoc => {
      cpoDoc.items.forEach(item => {
        customerPoDetails.push({
          description: item.description || item.itemName || "N/A",
          qty: item.qty,
          price: item.price,
        });
      });
      cpoAmount += cpoDoc.totalAmount || 0;
    });

    // --- Fetch Purchase Orders ---
    const purchaseOrders = await PurchaseOrder.find(poFilter).lean();
    let purchaseOrderDetails = [];
    let itemCost = 0;

    purchaseOrders.forEach(poDoc => {
      poDoc.items.forEach(item => {
        purchaseOrderDetails.push({
          description: item.description || item.itemName || "N/A",
          qty: item.qty,
          price: item.unitCost,
        });
      });
      itemCost += poDoc.totalPurchaseAmount || 0;
    });

    // --- Remaining Purchase Orders (linked but not in fetched list) ---
    let remainingPurchaseOrder = [];
    if (cpo) {
      const allLinkedPOs = await PurchaseOrder.find({
        customerPO: new mongoose.Types.ObjectId(cpo),
      }).lean();

      const fetchedIds = new Set(purchaseOrders.map(po => po._id.toString()));

      remainingPurchaseOrder = allLinkedPOs
        .filter(po => !fetchedIds.has(po._id.toString()))
        .map(po => ({
          description: `PO #${po.poNumber}`,
          qty: po.items.reduce((sum, i) => sum + i.qty, 0),
          price: po.totalPurchaseAmount || 0,
        }));
    }

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
    console.error("Error in getProfitLoss:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
