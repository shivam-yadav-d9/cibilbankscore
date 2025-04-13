import express from "express";
import { saveCoApplicant } from "../controllers/coApplicantController.js";

const router = express.Router();

router.post("/save", saveCoApplicant);

export default router;
