import mongoose from "mongoose";

const B2BSignupSchema = new mongoose.Schema({
    userId: String,
    companyName: String,
    businessType: String,
    fullName: String,
    email: String,
    phone: String,
    password: String,
    userType: {
        type: String,
        default: "agent"
    }
});

const B2BSignup = mongoose.model("B2BSignup", B2BSignupSchema);
export default B2BSignup;
