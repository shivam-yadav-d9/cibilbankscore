import express from "express";
import { saveUserAddress } from "../controllers/UserAddressController.js";

const router = express.Router();

router.post("/save-user-address", saveUserAddress);

export default router;
