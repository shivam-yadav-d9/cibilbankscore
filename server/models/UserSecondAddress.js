// models/UserSecondAddress.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line1: { type: String, default: "" },
  address_line2: { type: String, default: "" },
  address_line3: { type: String, default: "" },
  pincode: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  landmark: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" }
});

const userSecondAddressSchema = new mongoose.Schema(
  {
    application_id: { type: String, required: true },
    residential_status: { type: String, default: "Resident" },
    residence_type: { type: String, default: "1" },
    years_of_residence: { type: String, default: "3" },
    monthly_rent: { type: String, default: "5000" },
    ref_code: { type: String, default: "OUI202590898" },
    addresses: {
      present_address: addressSchema,
      permanent_address: addressSchema,
      office_address: addressSchema
    }
  },
  { timestamps: true }
);

const UserSecondAddress = mongoose.model("UserSecondAddress", userSecondAddressSchema);

export default UserSecondAddress;