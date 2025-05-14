import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  doc_type: String,
  doc_no: String,
  file_data: String, // base64 or URL
  created_at: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bank_id: String,
  bank_name: String,
  loan_amount: Number,
  status: { type: String, default: "Pending" },
  documents: [documentSchema],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Application", applicationSchema);