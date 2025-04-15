import express from "express";
import { signupB2BUser, loginAgent } from "../controllers/B2BSignup.js";

const router = express.Router();

router.post("/signup", signupB2BUser);
router.post("/login", loginAgent);

export default router;