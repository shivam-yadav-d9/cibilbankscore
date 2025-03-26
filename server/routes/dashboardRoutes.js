import express from "express";
import { getAllUsers, getAllProfiles } from "../controllers/dashboardController.js"; // ✅ Import

const router = express.Router();

router.get("/users", getAllUsers);        // Get all registered users
router.get("/profiles", getAllProfiles);  // Get all profiles

export default router;
