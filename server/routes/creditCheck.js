import express from "express";
import { checkCredit } from "../controllers/creditCheckController.js";
const router = express.Router();

router.post("/check", checkCredit);

export default router;