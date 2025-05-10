import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String }
});

const userReferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // Add userId
  userType: { type: String, required: true, enum: ['customer', 'agent', 'business'] },  // Add userType
  application_id: { type: String, required: true, unique: true },
  ref_code: { type: String, required: true },
  reference1: { type: referenceSchema, required: true },
  reference2: { type: referenceSchema, required: true },

  created_at: { type: Date, default: Date.now }
});

const UserReference = mongoose.model('userreferences', userReferenceSchema);

export default UserReference;
