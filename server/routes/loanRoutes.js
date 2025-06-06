import express from "express";
import { storeLoanDetails, getLoanDetailsByEmail,getLoanDetailsByUser ,  getCibilScoreByMobile} from "../controllers/loanController.js";

const router = express.Router();

router.post("/store", storeLoanDetails); // **Route is now /store**

router.get("/get-by-email/:email", getLoanDetailsByEmail); // <--- Add this

router.get("/details", getLoanDetailsByUser);
router.get("/cibil/:mobile", getCibilScoreByMobile); // ✅ NEW route


export default router;