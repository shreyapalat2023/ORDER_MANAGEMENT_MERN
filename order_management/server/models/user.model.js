import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    role: {
        type: Number,
        default: 1
    },

    otp: String,
    otpExpiry: Date,
}, { timestamps: true })

export default mongoose.model("User", userSchema);