import express from "express";
import { updateUserProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/update", updateUserProfile); // Store profile data

export default router;
