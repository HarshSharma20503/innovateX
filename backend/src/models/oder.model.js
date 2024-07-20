import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        itemName: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'pending'
        },
        track: [String],
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);