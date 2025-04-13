import express from "express";
import { saveUserReferences } from "../controllers/userReferencesController.js";

const router = express.Router();

router.post("/save", saveUserReferences);

export default router;
