import express from "express";
import { getMyApplications, createApplication, getApplicationById } from "../controllers/applicationController.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", auth, getMyApplications);
router.post("/", auth, createApplication);
router.get("/:id", auth, getApplicationById);

export default router;