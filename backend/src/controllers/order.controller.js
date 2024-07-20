import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/oder.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";

export const addOrder = AsyncHandler(async (req, res) => {
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

  // Create a tsx hash
  const tsxHash = "0x000000000000";
  //

  const order = await Order.create({
    itemName,
    to: { id: recieverUser._id },
    from: { id: user._id },
    imgUrl,
    track,
    status: "accepted",
    tsxHash,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }
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
  const tsxHash = order["tsxHash"];
  console.log(order);
  console.log(tsxHash);

  res.status(200).json(new ApiResponse(200, {}, "Order Details successfully fetched"));
});
