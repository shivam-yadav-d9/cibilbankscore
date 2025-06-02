// routes/creditScoreRoutes.js
import express from "express";
import { checkCreditScore, getCibilScoreByPhone } from "../controllers/creditCheckController.js";

const router = express.Router();

router.post("/check", checkCreditScore);
router.get("/get-from-db", getCibilScoreByPhone); // ✅ changed to GET

export default router;
