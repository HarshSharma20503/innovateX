import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.js";
import { confirmTransaction, getOtp, sendOtp, verifyOtp } from "../controllers/transfer.controllers.js";
// Create a new router instance
const router = Router();

router.route("/sendOtp/:orderId").post(validateToken, sendOtp);
router.route("/verifyOtp/:orderId").post(validateToken, verifyOtp);
router.route("/getOtp/:orderId").get(validateToken, getOtp);
router.route("/confirm/:orderId").post(validateToken, confirmTransaction);

export default router;
