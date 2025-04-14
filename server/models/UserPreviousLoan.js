import mongoose from "mongoose";

const loanDataSchema = new mongoose.Schema({
  loan_account_no: { type: String, required: true },
  loan_year: { type: String, required: true },
  loan_amount: { type: String, required: true },
  emi_amount: { type: String, required: true },
  product: { type: String, required: true },
  bank_name: { type: String, required: true }
});

const userPreviousLoanSchema = new mongoose.Schema({
  ref_code: { type: String, required: true },
  application_id: { type: String, required: true, unique: true },
  loan_data: [loanDataSchema],
  evolutoResponse: { type: mongoose.Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now }
});

const UserPreviousLoan = mongoose.model("UserPreviousLoan", userPreviousLoanSchema);
export default UserPreviousLoan;