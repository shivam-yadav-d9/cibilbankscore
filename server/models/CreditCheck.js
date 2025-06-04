import mongoose from "mongoose";

const creditScoreSchema = new mongoose.Schema({
    ref_code: String,
    fname: String,
    lname: String,
    phone: String,
    pan_no: String,
    dob: String,
    credit_score: Number,
    status: Number,
    message: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CreditScore", creditScoreSchema);