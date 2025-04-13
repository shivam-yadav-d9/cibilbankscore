import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line1: { type: String },
  address_line2: { type: String },
  address_line3: { type: String },
  pincode: { type: String },
  state: { type: String },
  city: { type: String },
  landmark: { type: String },
  email: { type: String },
  phone: { type: String }
}, { _id: false });

const userSecondAddressSchema = new mongoose.Schema({
  application_id: { type: String, required: true },
  residential_status: { type: String, required: true },
  residence_type: { type: String, required: true },
  years_of_residence: { type: String, required: true },
  monthly_rent: { type: String, required: true },
  ref_code: { type: String, required: true },
  addresses: {
    present_address: { type: addressSchema, required: true },
    permanent_address: { type: addressSchema, required: true },
    office_address: { type: addressSchema, required: true }
  }
}, { timestamps: true });

export default mongoose.model("UserSecondAddress", userSecondAddressSchema);
