import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.js";
import { sendOtp, verifyOtp } from "../controllers/transfer.controllers.js";
// Create a new router instance
const router = Router();

router.route('/sendOtp/:orderId').post(validateToken, sendOtp);
router.route('/verifyOtp/:orderId').post(validateToken, verifyOtp);


export default router;