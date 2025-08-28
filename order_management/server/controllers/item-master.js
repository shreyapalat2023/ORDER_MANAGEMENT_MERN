import Item from "../models/item.model.js"


// CREATE
export const create = async (req, res) => {
    try {
        const { name, category, brand, stock, unit, status, supplier, description } = req.body;

        if (!name || !category || !brand || !unit || !status || !supplier) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const item = new Item({
            name,
            category,
            brand,
            stock: stock || [],   // default empty array
            unit,
            status,
            supplier,
            description,
        });

        // Step 2: Save it
        const savedItem = await item.save();

        // Step 3: Populate
        const populatedItem = await Item.findById(savedItem._id).populate("supplier", "name").populate("stock.item", "name");

        res.status(201).json({
            message: "Item added successfully",
            item: populatedItem,
        });

    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to add item." });
    }
};



export const list = async (req, res) => {
    try {
        const items = await Item.find({})
            .populate("supplier", "name status")
            .populate("stock.item", "name")  // <-- populate stock.item with item name
            .sort({ createdAt: -1 });

        // const itemsWithTotal = items.map(item => {
        //     const totalStock = item.stock.reduce((sum, s) => sum + (s.quantity || 0), 0);
        //     return {
        //         ...item.toObject(),
        //         totalStock,
        //     };
        // });

        res.json(items);
    } catch (error) {
        console.error("List Error:", error);
        res.status(500).json({ error: "Failed to list all items" });
    }
};


//update

export const update = async (req, res) => {
    try {
        const updatedData = req.body;
        const { itemId } = req.params;
        // Basic validation
        const requiredFields = ["name", "category", "brand", "unit", "status", "supplier"];

        for (const field of requiredFields) {
            if (!updatedData[field]) {
                return res.status(400).json({ error: `${field} is required.` });
            }
        }
        const item = await Item.findByIdAndUpdate(itemId, updatedData, { new: true }).populate("supplier", "name").populate("stock.item", "name");
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({ error: "Failed to update item" })
    }
}

//remove

export const remove = async (req, res) => {
    try {
        const { itemId } = req.params
        const removed = await Item.findByIdAndDelete(itemId);
        res.json(removed)

    } catch (error) {
        res.status(500).json({ error: "Server Error" })
    }
}

