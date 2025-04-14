import express from 'express';
import { saveUserPreviousLoans, getUserPreviousLoansByApplicationId } from '../controllers/userPreviousLoanController.js';

const router = express.Router();

router.post('/save', saveUserPreviousLoans);
router.get('/:application_id', getUserPreviousLoansByApplicationId);

export default router;