import mongoose from "mongoose";

const LoanApplicationSchema = new mongoose.Schema({
  ref_code: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  dob: { type: String, required: true },
  city: String,
  pincode: String,
  income_source: { type: Number, required: true },
  monthly_income: { type: String, required: true },
  loan_amount: { type: String, required: true },
  pan: {
    type: String,
    required: true,
    uppercase: true,
    match: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
  },
  aadhaar: String,
  loan_type_id: { type: String, required: true },
  preferred_banks: {
    type: [Number],
    default: [],
  },
  application_id: { type: String, required: true },

  // Store userId and userType directly
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Optional: Reference to User model
  },
  cibil_score: {
    type: String,
  },

  userType: {
    type: String,
    required: true,
    enum: ['customer', 'agent', 'business'] // Add 'business' here
  }
}, {
  timestamps: true,
});

const LoanApplication = mongoose.model("LoanApplication", LoanApplicationSchema);
export default LoanApplication;
