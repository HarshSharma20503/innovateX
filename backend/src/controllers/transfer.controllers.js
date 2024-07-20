import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import otpGenerator from 'otp-generator'
import { Router } from "express";
import { sendMailWithText } from "../utils/SendMail.js";
import { Order } from "../models/oder.model.js";

// Sender generates otp and send to next expected reciever
export const sendOtp = AsyncHandler(async (req, res) => {
    const user = req.user;
    const { orderId } = req.params;
    if (!user || !orderId) {
        throw new ApiError(400, "Invalid Action");
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    const currentUserMail = user['email'];

    // select mailId on basis of current owner and next reciever (from blockchain)
    const currentOwner = "";
    const mailId = "sparshrajput92@gmail.com";

    // check that currentUserMail should be equal to currentOwner
    // 

    const subject = "OTP for reciever Verification";
    const text = `You OTP is: ${otp}`;
    const sentMail = await sendMailWithText(mailId, subject, text);
    console.log(otp);

    // store otp and current time stamp in database
    const order = await Order.updateOne({ _id: orderId }, {
        current_otp: otp,
        timestamp_otp: Date.now()
    })

    res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
})

export const verifyOtp = AsyncHandler(async (req, res) => {
    const user = req.user;
    const { orderId } = req.params;
    const { otp } = req.body;
    console.log('otp: ', otp);
    if (!user || !orderId) {
        throw new ApiError(400, "Invalid Action");
    }

    const order = await Order.findOne({ _id: orderId });
    const currentUserMail = user['email'];

    // get current Owner from blockchain and compare that with currentUserMail
    // 

    const current_otp = order['current_otp'];
    const time_since_otp_generated = (Date.now() - order['timestamp_otp']) / 1000;
    console.log(time_since_otp_generated);

    if (time_since_otp_generated > 120) {
        res.json(new ApiResponse(400, { success: false }, "OTP expired!!! Resend OTP"));
    }

    if (current_otp !== otp) {
        res.json(new ApiResponse(400, { success: false }, "Wrong OTP"));
    }

    res.status(200).json(new ApiResponse(200, { success: true }, "Otp verification Successfull"))
})

export const transferCompleted = AsyncHandler(async (req, res) => {
    // change state in transaction in blockchain
})