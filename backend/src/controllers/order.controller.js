import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/oder.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";
import QRCode from "qrcode";

export const addOrder = AsyncHandler(async (req, res) => {
  console.log("******* inside the addOrder function ********");
  //   {
  //     "identifiers": {
  //         "rfid": "3712",
  //         "qr": "1002"
  //     },
  //     "ownership": {
  //         "current_owner": "xyz",
  //         "previous_owners": [],
  //         "location": "warehouse",
  //         "timestamp": "2024-07-20T10:00:00Z"
  //     },
  //     "data": {
  //         "item": "sennheiser ie 200",
  //         "seller": "headphone zone",
  //         "buyer": "devanshamity@gmail.com",
  //         "source": "mumbai",
  //         "destination": "delhi"
  //     },
  //     "status": {
  //         "delivered": false,
  //         "paid": false
  //     },
  //     "tracking": []
  // }

  const user = req.user;
  if (!user || user.userType !== "Seller") {
    throw new ApiError(400, "Invalid Operation for current user");
  }

  const { itemName, sendTo, imageUrl } = req.body;
  let imgUrl = imageUrl;

  if (!itemName || !sendTo || !imgUrl) {
    throw new ApiError(400, "All fields are required");
  }

  const recieverUser = await User.findOne({ email: sendTo });
  if (!recieverUser) {
    throw new ApiError(400, "Reciever not found");
  }

  console.log("recieverUser: ", recieverUser);

  // console.log(recieverUser._id);
  const track = [{ id: "669c7e964f903c7d64c41623" }];

  let order = await Order.create({
    itemName,
    to: { id: recieverUser._id },
    from: { id: user._id },
    imgUrl,
    track,
    status: "accepted",
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }

  console.log("Created order: ", order);

  // Create a tsx hash
  const nftMint = {
    identifiers: {
      rfid: "3712",
      qr: "1002",
    },
    ownership: {
      current_owner: user._id,
      previous_owners: [],
      location: "warehouse",
      timestamp: "2024-07-20T10:00:00Z",
    },
    data: {
      item: itemName,
      seller: user.name,
      buyer: recieverUser.email,
      source: "mumbai",
      destination: "delhi",
    },
    status: {
      delivered: false,
      paid: false,
    },
    tracking: [],
  };

  const url = process.env.GO_URL;

  function randomStr(len, arr) {
    let ans = "";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }

  const generatedId = randomStr(10, "1234567890abcdef");

  console.log("generatedId: ", generatedId);

  const response = await fetch(`${url}/create/${generatedId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(nftMint),
  });

  const resp = await response.json();

  console.log("Minted NFT: ", resp);

  const txnHash = resp.txn_hash;

  console.log("txnHash: ", txnHash);

  // put txnHash in order database
  const details_for_qr = {
    itemName: order["itemName"],
    from: order["from"],
    to: order["to"],
    imageUrl: order["imgUrl"],
  };
  // Converting the data into String format
  let stringdata = JSON.stringify(details_for_qr);
  let qrCode;
  QRCode.toDataURL(stringdata, function (err, code) {
    if (err) return console.log("error occurred");

    // Printing the code
    console.log("qrCode: ", code);
    qrCode = code;
  });

  await Order.updateOne(
    { _id: order["_id"] },
    {
      txnHash: txnHash,
      orderId: generatedId,
      qr: qrCode,
    }
  );

  //
  const updateResult1 = await User.updateOne(
    { _id: user._id },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  console.log("updateResult1: ", updateResult1);
  const updateResult2 = await User.updateOne(
    { _id: recieverUser._id },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  console.log("updateResult2: ", updateResult2);
  const updateResult3 = await User.updateOne(
    { _id: "669c7e964f903c7d64c41623" },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );

  res.status(200).json(new ApiResponse(200, { qrCode }, "Order Successfully registered"));
});

export const uploadPic = AsyncHandler(async (req, res) => {
  console.log("******* inside the upload Pic function ********");
  const LocalPath = req.files?.picture[0]?.path;
  console.log("LocalPath: ", LocalPath);

  if (!LocalPath) {
    throw new ApiError(400, "Picture file is required");
  }
  const picture = await uploadOnCloudinary(LocalPath);

  console.log("Picture: ", picture);
  if (!picture) {
    throw new ApiError(500, "Error uploading picture");
  }

  res.status(200).json(new ApiResponse(200, { url: picture.url }, "Picture uploaded successfully"));
});

export const showAll = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Invalid action");
  }

  const orders = await user.orders;
  const data = [];
  await Promise.all(
    orders?.map(async (item) => {
      const ord = await Order.findById(item);
      const temp = {
        id: ord["_id"],
        itemName: ord["itemName"],
        status: ord["status"],
      };
      data.push(temp);
    })
  );
  res.status(200).json(new ApiResponse(200, [...data], "orders successfully fetched"));
});

export const orderDetails = AsyncHandler(async (req, res) => {
  const user = req.user;
  const { orderId } = req.params;
  console.log(orderId);
  if (!user || !orderId) {
    throw new ApiError(400, "Invalid action");
  }

  const order = await Order.findOne({ _id: orderId });
  const txnHash = order["txnHash"];
  console.log("order: ", order);
  console.log("txnHash: ", txnHash);

  const url = process.env.GO_URL;
  const response = await fetch(`${url}/get/${txnHash}`, {
    method: "GET",
  });

  const orderDetails = await response.json();
  console.log(orderDetails);

  // order-> details stored in Database (created at the beginining)
  // orderDetails-> detials stored on blockchain (changing on each stage)

  let trackRecord = [];
  let order_user_status = {};
  let orderInfo = {};

  // basic order info
  const sender = await User.findOne({ _id: order["from"].id });
  const reciever = await User.findOne({ _id: order["to"].id });
  console.log("sender: ", sender);
  console.log("reciever: ", reciever);
  orderInfo = {
    itemName: order["itemName"],
    from: sender["email"],
    to: reciever["email"],
    imgUrl: order["imgUrl"],
  };
  console.log("orderInfo: ", orderInfo);

  // track record
  const fullTrack = order["track"];
  console.log("fullTrack: ", fullTrack);
  const previous_owners = orderDetails.ownership.previous_owners;
  const current_owner = orderDetails.ownership.current_owner;
  console.log("previous_owners: ", previous_owners);
  console.log("current_owner: ", current_owner);
  console.log("previous_owners.length: ", previous_owners.length != 0);
  let flag = previous_owners.length != 0;
  trackRecord.push({
    id: sender["_id"],
    name: sender["name"],
    email: sender["email"],
    send_status: flag,
    recieve_status: true,
  });
  let previous_flag = flag;
  // await Promise.all(
  //   fullTrack.forEach(async (item) => {
  //     console.log("item: ", item);
  //     const middle = await User.findOne({ _id: item.id });
  //     console.log("middle: ", middle);
  //     flag = previous_owners.length != 0 && previous_owners.find((x) => x == item.id) != undefined;
  //     trackRecord.push({
  //       id: item.id,
  //       name: middle["name"],
  //       email: middle["email"],
  //       send_status: flag,
  //       recieve_status: previous_flag,
  //     });
  //     previous_flag = flag;
  //   })
  // );
  // fullTrack.forEach(async (item) => {
  // console.log("item: ", item);

  let item = fullTrack[0];
  let middle = await User.findOne({ _id: item.id });
  console.log("middle: ", middle);
  flag =
    previous_owners.length != 0 &&
    previous_owners.find((x) => {
      return x.toString() == item.id.toString();
    }) != undefined;
  trackRecord.push({
    id: item.id,
    name: middle["name"],
    email: middle["email"],
    send_status: flag,
    recieve_status: previous_flag,
  });
  previous_flag = flag;

  // item = fullTrack[1];
  // middle = await User.findOne({ _id: item.id });
  // console.log("middle: ", middle);
  // flag =
  //   previous_owners.length != 0 &&
  //   previous_owners.find((x) => {
  //     return x.toString() == item.id.toString();
  //   }) != undefined;
  // trackRecord.push({
  //   id: item.id,
  //   name: middle["name"],
  //   email: middle["email"],
  //   send_status: flag,
  //   recieve_status: previous_flag,
  // });
  // previous_flag = flag;

  console.log("trackRecord: ", trackRecord);
  trackRecord.push({
    id: reciever["_id"],
    name: reciever["name"],
    email: reciever["email"],
    send_status: false,
    recieve_status: current_owner.toString() == reciever["_id"].toString(),
  });

  console.log("track: ", trackRecord);
  // order_user_status
  const order_user_track = trackRecord.find((x) => {
    // console.log(x.id.toString(), user._id.toString());
    return x.id.toString() == user._id.toString();
  });
  order_user_status = {
    sent: order_user_track?.send_status ? order_user_track.send_status : false,
    recieved: order_user_track?.recieve_status ? order_user_track.recieve_status : false,
  };

  res
    .status(200)
    .json(new ApiResponse(200, { orderInfo, order_user_status, trackRecord }, "Order Details successfully fetched"));
});
