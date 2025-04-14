import express from "express";
import { saveUserReferences, getUserReferencesByApplicationId } from "../controllers/userReferencesController.js";

const router = express.Router();

// Route to save user references
router.post("/save", saveUserReferences);

// Route to get user references by application_id
router.get("/:application_id", getUserReferencesByApplicationId);

export default router;