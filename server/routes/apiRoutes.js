import express from "express";
import { getApiToken, checkCreditScore } from "../controllers/apiController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/token', auth, getApiToken);
router.post('/check-score', auth, checkCreditScore);

export default router;
