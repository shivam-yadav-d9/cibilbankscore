import express from "express";
import { storeLoanDetails, getLoanDetailsByEmail } from "../controllers/loanController.js";

const router = express.Router();

router.post("/store", storeLoanDetails); // **Route is now /store**

router.get("/get-by-email/:email", getLoanDetailsByEmail); // <--- Add this

export default router;