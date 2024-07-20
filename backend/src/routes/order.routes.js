import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.js";

// Create a new router instance
const router = Router();

/**
 * @route   POST /api/auth/signUp
 * @desc    Register a new user
 * @access  Public
 */
router.route("/addOrder").post();

export default router;