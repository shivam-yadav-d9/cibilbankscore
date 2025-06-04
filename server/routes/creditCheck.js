import express from "express";
import { checkCreditScore, fetchToken, getCreditScoreByPhone } from "../controllers/creditCheckController.js";

const router = express.Router();

router.post("/getToken", fetchToken);
router.post("/check", checkCreditScore);
router.get("/get-from-db", getCreditScoreByPhone);

export default router;