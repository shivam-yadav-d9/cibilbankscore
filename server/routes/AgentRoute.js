import express from "express";
import { signupB2BUser, loginAgent, getAllAgents ,deleteAgent,approveAgent,rejectAgent,getAgentById,getAllAgentswithpagination} from "../controllers/B2BSignup.js";

const router = express.Router();

router.post("/signup", signupB2BUser);
router.post("/login", loginAgent);

//New route for admin
router.get("/agents", getAllAgents);
router.get("/agent", getAllAgentswithpagination);

router.delete('/agents/:id', deleteAgent); // 👈 delete route here

router.put("/approve/:id", approveAgent);
router.put("/reject/:id", rejectAgent);
router.get('/agent/:id', getAgentById); // This must match the frontend URL


export default router;
