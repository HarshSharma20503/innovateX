import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addOrder, orderDetails, showAll, uploadPic } from "../controllers/order.controller.js";
// Create a new router instance
const router = Router();

/**
 * @route   POST /api/auth/signUp
 * @desc    Register a new user
 * @access  Public
 */
router.route("/addOrder").post(validateToken, addOrder);
router.route("/uploadPicture").post(validateToken, upload.fields([{ name: "picture", maxCount: 1 }]), uploadPic);
router.route("/showAll").get(validateToken, showAll);
router.route(`/orderDetails/:orderId`).get(validateToken, orderDetails);
export default router;