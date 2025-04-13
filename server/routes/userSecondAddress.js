import express from "express";
import { saveUserSecondAddress } from "../controllers/userSecondAddressController.js";

const router = express.Router();

router.post("/save", saveUserSecondAddress);

export default router;
