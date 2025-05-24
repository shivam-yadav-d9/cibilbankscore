import express from 'express';
import { getLoanStatus } from '../controllers/loanStatusController.js';

const router = express.Router();

router.post('/check-loan-status', getLoanStatus);

export default router;