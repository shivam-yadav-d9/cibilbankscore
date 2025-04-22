import express from "express";
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js";

const router = express.Router();

// Route for forgot password
router.post("/forgot-password", forgotPassword);

// Route for reset password
router.post("/reset-password", resetPassword);

export default router;