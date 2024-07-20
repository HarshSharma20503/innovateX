import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/oder.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";

export const addOrder = AsyncHandler(async (req, res) => {

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

  const { itemName, sendTo, imgUrl } = req.body;

  if (!itemName || !sendTo || !imgUrl) {
    throw new ApiError(400, "All fields are required");
  }

  const recieverUser = await User.findOne({ email: sendTo });
  if (!recieverUser) {
    throw new ApiError(400, "Reciever not found");
  }

  // console.log(recieverUser._id);
  const track = [{ id: "669baf564f903c7d64c4161c" }, { id: "669baf994f903c7d64c4161d" }];


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

  // Create a tsx hash
  const nftMint = {
    "identifiers": {
      "rfid": "3712",
      "qr": "1002"
    },
    "ownership": {
      "current_owner": user._id,
      "previous_owners": [],
      "location": "warehouse",
      "timestamp": "2024-07-20T10:00:00Z"
    },
    "data": {
      "item": itemName,
      "seller": user.name,
      "buyer": recieverUser.email,
      "source": "mumbai",
      "destination": "delhi"
    },
    "status": {
      "delivered": false,
      "paid": false
    },
    "tracking": []
  };

  const url = process.env.GO_URL;

  function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
      ans +=
        arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans;
  }

  const generatedId = randomStr(10, '1234567890abcdef');
  const response = await fetch(`${url}/create/${generatedId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(nftMint)
  })

  const resp = await response.json();

  const txnHash = resp.txn_hash;

  // put txnHash in order database
  await Order.updateOne({ _id: order['_id'] }, {
    txnHash: txnHash,
    orderId: generatedId
  })

  //
  const updateResult1 = await User.updateOne(
    { _id: user._id },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  const updateResult2 = await User.updateOne(
    { _id: recieverUser._id },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  const updateResult3 = await User.updateOne(
    { _id: "669baf564f903c7d64c4161c" },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  const updateResult4 = await User.updateOne(
    { _id: "669baf994f903c7d64c4161d" },
    {
      $push: {
        orders: order._id.toString(),
      },
    }
  );
  res.status(200).json(new ApiResponse(200, {}, "Order Successfully registered"));
});

export const uploadPic = AsyncHandler(async (req, res) => {
  const LocalPath = req.files?.picture[0]?.path;

  if (!LocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const picture = await uploadOnCloudinary(LocalPath);
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
  res.status(200).json(new ApiResponse(200, "orders successfully fetched", ...data));
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
  console.log(order);
  console.log(txnHash);

  const url = process.env.GO_URL;
  const response = await fetch(`${url}/get/${txnHash}`, {
    method: 'GET'
  });

  const orderDetails = await response.json();
  console.log(orderDetails);

  res.status(200).json(new ApiResponse(200, { orderDetails }, "Order Details successfully fetched"));
});