// models/complaint.js
import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  complaintText: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;