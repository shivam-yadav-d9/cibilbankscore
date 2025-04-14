import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String }
});

const userReferenceSchema = new mongoose.Schema({
  application_id: { type: String, required: true, unique: true },
  ref_code: { type: String, required: true },
  reference1: { type: referenceSchema, required: true },
  reference2: { type: referenceSchema, required: true },
  created_at: { type: Date, default: Date.now }
});

const UserReference = mongoose.model('UserReference', userReferenceSchema);

export default UserReference;