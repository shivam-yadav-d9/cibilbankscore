// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  utr: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Transaction', transactionSchema);