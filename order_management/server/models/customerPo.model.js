import mongoose, { mongo, Schema } from "mongoose";

const customerPOSchema = new Schema(
    {
        poNumber:{
            type:String,
            unique:true
        },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        date: Date,
        status: {
            type: String, enum: ["Active", "Inactive"], default: "Active"
        },
        items: [{
            item:
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Item"
            },
            qty: Number,
            unitCost: Number,
            tax: Number,
            salesPrice: Number
        }],
        totalAmount: {
            type:Number,
            default:"0"
        }
    },
    { timestamps: true });

    export default mongoose.model("CustomerPO",customerPOSchema);