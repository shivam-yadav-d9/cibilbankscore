import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line1: { type: String, default: "" },
  address_line2: { type: String, default: "" },
  address_line3: { type: String, default: "" },
  pincode: { type: String, default: "" }, // Make sure this is a string for flexibility (e.g., leading zeros)
  state: { type: Number, default: "" },   // String representation of the numeric state code
  city: { type: Number, default: "" },    // String representation of the numeric city code
  landmark: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" }
},
{ _id: false } 
);

const userSecondAddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },   // New field: userId (can be a string or number, depending on your needs)
    userType: { type: String, required: true },  // New field: userType (to indicate the type of user, e.g., "admin", "customer", "agent")
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

// Create a model for UserSecondAddress using the schema
const UserSecondAddress = mongoose.model("UserSecondAddress", userSecondAddressSchema);

export default UserSecondAddress;
