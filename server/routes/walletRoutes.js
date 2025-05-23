import express from 'express';
import multer from 'multer';
import { addFunds, getUserTransactions } from '../controllers/walletController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post('/add-funds', upload.single('screenshot'), addFunds);
router.get('/transactions', getUserTransactions);

export default router;
