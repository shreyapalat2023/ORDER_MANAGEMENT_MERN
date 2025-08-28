import mongoose, { mongo, Schema } from "mongoose";

const itemStockSchema = new Schema(
    {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        date: Date,
        quantity: Number,
        purchasePrice: Number
    }, { timestamps: true })
export default mongoose.model("ItemStock", itemStockSchema); 