import mongoose, { mongo, Schema } from "mongoose";

const purchaseOrderSchema = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        poNumber: {
            type:String,
            unique:true
        },
        customerPO: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerPO" },
        date: Date,
        status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        items: [{
            item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            qty: Number,
            unitCost: Number,
            tax: Number,
            purchasePrice: Number,
            invoiceNo: String,
            invoiceDate: Date
        }],
        totalPurchaseAmount: Number
    }
    , { timestamps: true })

export default mongoose.model("PurchaseOrder", purchaseOrderSchema)