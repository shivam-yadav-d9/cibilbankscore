import express from "express";
import { storeLoanDetails } from "../controllers/loanController.js";

const router = express.Router();

router.post("/store", storeLoanDetails); // **Route is now /store**

export default router;