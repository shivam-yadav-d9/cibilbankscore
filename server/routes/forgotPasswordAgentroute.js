import express from "express";
import {
  forgotPasswordAgent,
  resetPasswordAgent,
} from "../controllers/forgotPasswordAgent.js";

const router = express.Router();

// Route to send reset link to agent's email
router.post("/forgot-password", forgotPasswordAgent);

// Route to reset the password using token
router.post("/reset-password/:token", resetPasswordAgent);

export default router;
