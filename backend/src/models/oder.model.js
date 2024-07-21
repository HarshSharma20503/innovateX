import mongoose, { Schema } from "mongoose";

const senderSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    }
})
const recieverSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    recieved: {
        type: Boolean,
        default: false
    }
})
const middlemanSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    recieved: {
        type: Boolean,
        default: false
    },
    sent: {
        type: Boolean,
        default: false
    }
})
const orderSchema = new Schema(
    {
        itemName: {
            type: String,
            required: true
        },
        from: senderSchema,
        to: recieverSchema,
        status: {
            type: String,
            default: 'pending'
        },
        imgUrl: {
            type: String,
            required: true
        },
        track: [middlemanSchema],
        current_otp: {
            type: String,
        },
        timestamp_otp: {
            type: String
        },
        txnHash: {
            type: String
        },
        orderId: {
            type: String
        },
        qr: {
            type: String
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);


// Create and export the User model
export const Order = mongoose.model("Order", orderSchema);
