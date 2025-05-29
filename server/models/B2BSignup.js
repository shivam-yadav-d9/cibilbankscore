import mongoose from "mongoose";

const B2BSignupSchema = new mongoose.Schema({
    userId: String,
    companyName: String,
    businessType: String,
    fullName: String,
    email: String,
    phone: String,
    password: String,
    status: {
        type: String,
        enum: ['approved', 'rejected'],
        default: 'rejected'
    }, userType: {
        type: String,
        default: "business"
    }
}, { timestamps: true }); // 👈 This adds createdAt and updatedAt fields automatically

const B2BSignup = mongoose.model("Agent_Customers", B2BSignupSchema);
export default B2BSignup;