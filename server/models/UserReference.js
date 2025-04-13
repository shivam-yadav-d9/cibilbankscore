import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  email: String,
  phone: String,
  address: String
});

const userReferenceSchema = new mongoose.Schema({
  application_id: String,
  ref_code: String,
  reference1: referenceSchema,
  reference2: referenceSchema
});

const UserReference = mongoose.model("UserReference", userReferenceSchema);

export default UserReference;
