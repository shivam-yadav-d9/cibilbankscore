// routes/creditScoreRoutes.js
import express from "express";
import {checkCreditScore } from "../controllers/creditCheckController.js";

const router = express.Router();

router.post("/check",checkCreditScore);

export default router;
