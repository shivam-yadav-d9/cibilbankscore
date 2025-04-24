import express from 'express';
import { submitComplaint } from '../controllers/ExpertConnect.js';

const router = express.Router();

router.post('/submit', submitComplaint);

export default router;
