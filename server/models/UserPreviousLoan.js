import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  ref_code: String,
  application_id: String,
  loan_data: [
    {
      loan_account_no: String,
      loan_year: String,
      loan_amount: String,
      emi_amount: String,
      product: String,
      bank_name: String
    }
  ],
  evolutoResponse: Object
});

const UserPreviousLoan = mongoose.model("UserPreviousLoan", loanSchema);
export default UserPreviousLoan;
