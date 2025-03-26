import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  phoneNumber: { type: String, required: true },
  pan: { type: String, required: true },
  aadhar: { type: String, required: true },
  dob: { type: Date, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: Number, required: true },
  creditScore: { type: Number, default: 0 }, // Default value if not provided
});

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
