
// controllers/walletController.js
import Transaction from '../models/WalletTransaction.js';

export const addFunds = async (req, res) => {
  try {
    const { amount, utr } = req.body;
    const screenshot = req.file?.filename;

    if (!amount || !utr || !screenshot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = await Transaction.create({
      amount,
      utr,
      screenshot,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};