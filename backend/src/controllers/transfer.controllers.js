import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import otpGenerator from "otp-generator";
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

  // const currentUserMail = user['email'];

  // // select mailId on basis of current owner and next reciever (from blockchain)
  // const currentOwner = "";
  // const mailId = "sparshrajput92@gmail.com";

  // // check that currentUserMail should be equal to currentOwner
  // //

  // const subject = "OTP for reciever Verification";
  // const text = `You OTP is: ${otp}`;
  // const sentMail = await sendMailWithText(mailId, subject, text);
  // console.log(otp);

  // store otp and current time stamp in database
  const order = await Order.updateOne(
    { _id: orderId },
    {
      current_otp: otp,
      timestamp_otp: Date.now(),
    }
  );

  res.status(200).json(new ApiResponse(200, {}, "OTP sent"));
});

export const getOtp = AsyncHandler(async (req, res) => {
  const user = req.user;
  const { orderId } = req.params;
  if (!user || !orderId) {
    throw new ApiError(400, "Invalid Action");
  }
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new ApiError(400, "Invalid Action");
  }

  const otp = order["current_otp"];
  res.status(200).json(new ApiResponse(200, { otp }, "OTP fetched"));
});

export const verifyOtp = AsyncHandler(async (req, res) => {
  console.log("******** Inside the verifyOtp function ********");
  const user = req.user;
  const { orderId } = req.params;
  const { otp } = req.body;
  console.log("otp: ", otp);
  if (!user || !orderId) {
    throw new ApiError(400, "Invalid Action");
  }

  const order = await Order.findOne({ _id: orderId });
  // const currentUserMail = user['email'];

  // // get current Owner from blockchain and compare that with currentUserMail
  // //

  const current_otp = order["current_otp"];
  const time_since_otp_generated = (Date.now() - order["timestamp_otp"]) / 1000;
  console.log(time_since_otp_generated);

  if (time_since_otp_generated > 120) {
    return res.status(200).json(new ApiResponse(400, { success: false }, "OTP expired!!! Resend OTP"));
  }

  if (current_otp !== otp) {
    return res.status(200).json(new ApiResponse(400, { success: false }, "Wrong OTP"));
  }

  return res.status(200).json(new ApiResponse(200, { success: true }, "Otp verification Successfull"));
});

export const confirmTransaction = AsyncHandler(async (req, res) => {
  const user = req.user;
  const { orderId } = req.params;
  if (!user || !orderId) {
    throw new ApiError(400, "Invalid Action");
  }
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new ApiError(400, "Invalid Action");
  }
  let txnHash = order["txnHash"];
  console.log("order: ", order);
  console.log("txnHash: ", txnHash);

  const url = process.env.GO_URL;
  let response = await fetch(`${url}/get/${txnHash}`, {
    method: "GET",
  });

  let orderDetails = await response.json();
  console.log(orderDetails);

  const current_owner = orderDetails.ownership.current_owner;
  orderDetails.ownership.previous_owners.push(current_owner);
  orderDetails.tracking.push({
    latitude: "21.03",
    longitude: "24.56",
    handler: orderDetails.current_owner,
    timestamp: "2024-07-20T21:00:00Z",
  });
  orderDetails.ownership.current_owner = user._id;

  if (orderDetails.ownership.previous_owners.length == order["track"].length + 1) {
    orderDetails.delivered.delivered = true;
    orderDetails.delivered.paid = true;
    await Order.updateOne(
      { _id: order["_id"] },
      {
        status: "delivered",
      }
    );
  }

  response = await fetch(`${url}/update/${order["orderId"]}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(orderDetails),
  });

  const resp = await response.json();

  console.log("Minted NFT: ", resp);

  txnHash = resp.txn_hash;

  console.log("txnHash: ", txnHash);

  await Order.updateOne(
    { _id: order["_id"] },
    {
      txnHash: txnHash,
    }
  );
  response = await fetch(`${url}/get/${txnHash}`, {
    method: "GET",
  });

  orderDetails = await response.json();
  console.log(orderDetails);
  res.status(200).json(new ApiResponse(200, {}, "Step confirmed successfuly"));
});
