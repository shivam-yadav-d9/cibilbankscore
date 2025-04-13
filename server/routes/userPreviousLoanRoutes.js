import express from "express";
import { saveUserPreviousLoans } from "../controllers/userPreviousLoanController.js";

const router = express.Router();

router.post("/save", saveUserPreviousLoans);

export default router;
