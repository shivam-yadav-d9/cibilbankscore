// models/WalletTransaction.js
import mongoose from 'mongoose';

const WalletTransactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  utr: {
    type: String,
    required: function() {
      return this.type === 'credit'; // UTR only required for credit transactions
    }
  },
  screenshot: {
    type: String,
    required: function() {
      return this.type === 'credit'; // Screenshot only required for credit transactions
    }
  },
  description: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're handling timestamps manually
});

// Index for better query performance
WalletTransactionSchema.index({ email: 1, status: 1 });
WalletTransactionSchema.index({ created_at: -1 });

// Update the updated_at field before saving
WalletTransactionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model('WalletTransaction', WalletTransactionSchema);