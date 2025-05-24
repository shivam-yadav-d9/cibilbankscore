// controllers/walletController.js
import Transaction from '../models/WalletTransaction.js';
import path from 'path';
import fs from 'fs';

export const addFunds = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { email, amount, utr } = req.body;
    const screenshot = req.file?.filename;

    // Validate required fields
    if (!email || !amount || !utr || !screenshot) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (email, amount, utr, screenshot)',
        received: { email, amount, utr, screenshot: !!screenshot }
      });
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid positive number'
      });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      email,
      amount: numAmount,
      utr,
      screenshot,
      type: 'credit',
      status: 'pending',
      created_at: new Date()
    });

    console.log('Transaction created successfully:', transaction._id);

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully! It will be verified and added to your wallet.',
      transaction: {
        id: transaction._id,
        email: transaction.email,
        amount: transaction.amount,
        utr: transaction.utr,
        type: transaction.type,
        status: transaction.status,
        created_at: transaction.created_at
      }
    });
  } catch (err) {
    console.error('Add funds error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Calculate balance from approved transactions
    const transactions = await Transaction.find({
      email,
      status: 'approved'
    });

    let balance = 0;
    transactions.forEach(txn => {
      const amount = parseFloat(txn.amount) || 0;
      if (txn.type === 'credit') {
        balance += amount;
      } else if (txn.type === 'debit') {
        balance -= amount;
      }
    });

    // Ensure balance is not negative
    balance = Math.max(0, balance);

    res.json({ 
      success: true,
      balance: parseFloat(balance.toFixed(2))
    });
  } catch (err) {
    console.error('Get balance error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch balance',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const transactions = await Transaction.find({ email })
      .sort({ created_at: -1 })
      .select('amount type status utr description created_at updated_at');

    res.json({
      success: true,
      transactions
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const spendMoney = async (req, res) => {
  try {
    const { email, amount, description } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and amount are required' 
      });
    }

    const spendAmount = parseFloat(amount);
    
    if (isNaN(spendAmount) || spendAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount must be a valid positive number' 
      });
    }

    // Check current balance
    const transactions = await Transaction.find({
      email,
      status: 'approved'
    });

    let balance = 0;
    transactions.forEach(txn => {
      const txnAmount = parseFloat(txn.amount) || 0;
      if (txn.type === 'credit') {
        balance += txnAmount;
      } else if (txn.type === 'debit') {
        balance -= txnAmount;
      }
    });

    balance = Math.max(0, balance);

    if (spendAmount > balance) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient wallet balance',
        currentBalance: parseFloat(balance.toFixed(2)),
        requestedAmount: spendAmount
      });
    }

    // Create debit transaction
    const transaction = await Transaction.create({
      email,
      amount: spendAmount,
      type: 'debit',
      description: description || 'Wallet payment',
      status: 'approved', // Debit transactions are immediately approved
      created_at: new Date()
    });

    const newBalance = balance - spendAmount;

    res.status(201).json({
      success: true,
      message: 'Payment successful!',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        created_at: transaction.created_at
      },
      newBalance: parseFloat(newBalance.toFixed(2))
    });
  } catch (err) {
    console.error('Spend money error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Admin function to approve pending transactions
export const approveTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { 
        status: 'approved',
        updated_at: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Transaction approved successfully', 
      transaction 
    });
  } catch (err) {
    console.error('Approve transaction error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to approve transaction',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get all pending transactions (for admin) - MISSING FUNCTION
export const getPendingTransactions = async (req, res) => {
  try {
    const pendingTransactions = await Transaction.find({
      status: 'pending',
      type: 'credit'
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      transactions: pendingTransactions
    });
  } catch (err) {
    console.error('Get pending transactions error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pending transactions',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get all transactions (for admin) - NEW FUNCTION
export const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find({})
      .sort({ created_at: -1 });

    res.json({
      success: true,
      transactions: allTransactions
    });
  } catch (err) {
    console.error('Get all transactions error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch all transactions',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Reject transaction (admin)
export const rejectTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { 
        status: 'rejected',
        description: reason ? `Rejected: ${reason}` : 'Rejected by admin',
        updated_at: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Transaction rejected', 
      transaction 
    });
  } catch (err) {
    console.error('Reject transaction error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to reject transaction',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};