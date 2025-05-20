import express from "express";
import { signupB2BUser, loginAgent, getAllAgents ,deleteAgent} from "../controllers/B2BSignup.js";

const router = express.Router();

router.post("/signup", signupB2BUser);
router.post("/login", loginAgent);

//New route for admin
router.get("/agents", getAllAgents);
router.delete('/agents/:id', deleteAgent); // 👈 delete route here

export default router;
