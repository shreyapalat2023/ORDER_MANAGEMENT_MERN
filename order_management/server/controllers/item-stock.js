import Item from "../models/item.model.js";

export const addStock = async (req, res) => {
    try {
        const { itemId } = req.params;
        let { price, date, quantity } = req.body;

        // Convert to numbers to avoid NaN
        price = Number(price);
        quantity = Number(quantity);

        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ error: "Price and quantity must be valid numbers" });
        }

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });

        item.stock.push({ item: itemId, price, date, quantity });

        // Recalculate total stock safely
        item.totalStock = item.stock.reduce((sum, s) => sum + Number(s.quantity || 0), 0);

        await item.save();

        res.json(item);
    } catch (err) {
        console.error("Error adding stock:", err);
        res.status(500).json({ error: "Failed to add stock" });
    }
};

export const listStock = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId).populate("stock.item", "name");

        if (!item) return res.status(404).json({ error: "Item not found" });

        res.json(item.stock);
    } catch (err) {
        console.error("Error fetching stock:", err);
        res.status(500).json({ error: "Failed to fetch stock" });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { itemId, stockId } = req.params;
        let { price, date, quantity } = req.body;

        // Convert to numbers
        price = Number(price);
        quantity = Number(quantity);

        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ error: "Price and quantity must be valid numbers" });
        }

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });

        const stockEntry = item.stock.id(stockId);
        if (!stockEntry) return res.status(404).json({ error: "Stock entry not found" });

        stockEntry.price = price;
        stockEntry.date = date;
        stockEntry.quantity = quantity;

        item.totalStock = item.stock.reduce((sum, s) => sum + Number(s.quantity || 0), 0);

        await item.save();

        res.json(item);
    } catch (err) {
        console.error("Error updating stock:", err);
        res.status(500).json({ error: "Failed to update stock" });
    }
};

export const removeStock = async (req, res) => {
    try {
        const { itemId, stockId } = req.params;

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });

        item.stock = item.stock.filter(s => s._id.toString() !== stockId);

        item.totalStock = item.stock.reduce((sum, s) => sum + Number(s.quantity || 0), 0);

        await item.save();

        res.json(item);
    } catch (err) {
        console.error("Error removing stock:", err);
        res.status(500).json({ error: "Failed to delete stock" });
    }
};
