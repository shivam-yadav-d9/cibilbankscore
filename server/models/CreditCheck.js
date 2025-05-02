import mongoose from "mongoose";

const CreditCheckSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  phone: String,
  pan_no: String,
  dob: String,
  ref_code: String,
  result: mongoose.Schema.Types.Mixed, // Store the API response/result
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CreditCheck", CreditCheckSchema);