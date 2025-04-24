import mongoose from 'mongoose';

const expertConnectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  complaintText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ExpertConnect = mongoose.model('ExpertConnect', expertConnectSchema);
export default ExpertConnect;
