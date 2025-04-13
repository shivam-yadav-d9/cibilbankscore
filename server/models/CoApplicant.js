import mongoose from "mongoose";

const CoApplicantSchema = new mongoose.Schema({
  application_id: String,
  name: String,
  relationship: String,
  email: String,
  phone: String,
  address_line1: String,
  address_line2: String,
  address_line3: String,
  pincode: String,
  state: String,
  city: String,
  landmark: String,
  alternate_no: String,
  occupation: String,
  ref_code: String
});

const CoApplicant = mongoose.model("CoApplicant", CoApplicantSchema);

export default CoApplicant;
