import mongoose, { mongo, Schema } from "mongoose";

const itemSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        category: {
            type: String,
            trim: true,
            required: true
        },
        brand: String,
        stock: [{
            item:
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Item"
            },
            price: Number,
            date: Date,
            quantity: Number,
        }],
        totalStock: {
            type: Number,
            default: "0"
        },
        unit: String,
        status:
        {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },
        supplier:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier"
        },
        description: String
    }, { timestamps: true })

export default mongoose.model("Item", itemSchema);