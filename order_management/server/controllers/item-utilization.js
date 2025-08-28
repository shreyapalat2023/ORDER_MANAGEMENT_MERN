import Item from "../models/item.model.js"
import CustomerPO from "../models/customerPo.model.js"
import PurchaseOrder from "../models/purchaseOrder.model.js"

export const getItemUtilization = async (req, res) => {
    try {
        const { itemId } = req.params;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        //sales
        const sales = await CustomerPO.aggregate([
            { $unwind: "$items" },
            { $match: { "items.item": item._id } },
            {
                $project: {
                    _id: 0,
                    customerPO: "$poNumber",
                    qty: "$items.qty",
                    salesPrice: "$items.salesPrice",
                    date: "$date",
                },
            },
        ]);

        //purchases

        const purchases = await PurchaseOrder.aggregate([
            { $unwind: "$items" },
            { $match: { "items.item": item._id } },
            {
                $project: {
                    _id: 0,
                    purchaseOrder: "$poNumber",
                    qty: "$items.qty",
                    tax: "$items.tax",
                    purchasePrice: "$items.purchasePrice",
                    date: "$date",
                }
            }
        ]);

        const totalPurchased = purchases.reduce((acc, p) => acc + p.qty, 0);
        const totalSold = sales.reduce((acc, s) => acc + s.qty, 0);

        res.json({
            item: {
                id: item._id,
                name: item.name,
                category:item.category,
                brand:item.brand
            },
            utilization: {
                totalPurchased,
                totalSold,
                balance: totalPurchased - totalSold,
            },
            purchases,
            sales
        })

    } catch (error) {
        console.error("Error fetching item Utilization", err);
        res.status(500).json({ message: "Server error" });
    }
}