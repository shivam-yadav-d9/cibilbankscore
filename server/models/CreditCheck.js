// models/CreditScore.js
import mongoose from "mongoose";

const creditScoreSchema = new mongoose.Schema({
  ref_code: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: { type: String, required: true },
  pan_no: { type: String, required: true },
  dob: { type: String, required: true },
  credit_score: { type: Number },
  status: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const CreditScore = mongoose.model("CreditScore", creditScoreSchema);
export default CreditScore;
