import mongoose from "mongoose";

const coApplicantSchema = new mongoose.Schema({
  application_id: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the user model
    required: true
  },
  userType: {
    type: String,
    enum: ['customer', 'agent','business'],  // Add more user types if necessary
    required: true
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  relationship: {
    type: String,
    required: [true, "Relationship is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
  },
  address_line1: {
    type: String,
    required: [true, "Address line 1 is required"]
  },
  address_line2: String,
  address_line3: String,
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    match: [/^\d{6}$/, "Pincode must be exactly 6 digits"]
  },
  state: {
    type: String,
    required: [true, "State is required"]
  },
  city: {
    type: String,
    required: [true, "City is required"]
  },
  landmark: String,
  alternate_no: String,
  occupation: {
    type: String,
    required: [true, "Occupation is required"]
  },
  ref_code: String,
  evoluto_response: Object,
 
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date
});

const CoApplicant = mongoose.model("CoApplicant", coApplicantSchema);

export default CoApplicant;
