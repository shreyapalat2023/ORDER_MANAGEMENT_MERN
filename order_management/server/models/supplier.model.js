import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        phone: {
            type: Number,
            trim: true,
            required: true
        }, address: {
            type: String,
            required: true
        }, state: {
            type: String,
        }, city: {
            type: String,
        }, gstn: {
            type: String,
            required: true,
            unique: true
        },
        status:
        {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        }

    }, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);