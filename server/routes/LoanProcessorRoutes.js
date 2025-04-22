import express from 'express';
import { fetchToken, checkEligibility } from '../controllers/LoanProcessorController.js';

const router = express.Router();

router.post('/getToken', fetchToken); // Route to get token
router.post('/checkEligibility', checkEligibility); // Route to check eligibility

export default router;