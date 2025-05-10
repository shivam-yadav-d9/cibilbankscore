import mongoose from "mongoose";

// Schema for individual loan data without _id
const loanDataSchema = new mongoose.Schema({
  loan_account_no: { type: String, required: true },
  loan_year: { type: String, required: true },
  loan_amount: { type: String, required: true },
  emi_amount: { type: String, required: true },
  product: { type: String, required: true },
  bank_name: { type: String, required: true }
}, { _id: false }); // Disable _id for elements in the loan_data array

// Main schema for user previous loans
const userPreviousLoanSchema = new mongoose.Schema({
  ref_code: { type: String, required: true },
  application_id: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType' // Reference to either Customer or Agent collection
  },
  userType: {
    type: String,
    required: true,
    enum: ["Customer", "Agent","business"]
  },
  loan_data: [loanDataSchema], // Only store loan data without _id
  created_at: { type: Date, default: Date.now }
});

// Remove evolutoResponse field from schema
const UserPreviousLoan = mongoose.model("UserPreviousLoan", userPreviousLoanSchema);
export default UserPreviousLoan;
