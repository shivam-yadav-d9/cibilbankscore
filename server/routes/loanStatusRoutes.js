import express from 'express';
import { checkLoanStatus } from '../controllers/loanStatusController.js';

const router = express.Router();

// Route to check loan status
router.post('/check-loan-status', checkLoanStatus);

export default router;