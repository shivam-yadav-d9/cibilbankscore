import express from "express";
import { getApiToken, checkCreditScore, checkEligibility } from "../controllers/apiController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/token', auth, getApiToken);
router.post('/check-score', auth, checkCreditScore);
router.post('/loan/checkEligibility', auth, checkEligibility);

export default router;
