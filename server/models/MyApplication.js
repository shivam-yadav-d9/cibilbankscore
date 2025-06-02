import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    bank_id: { type: String, required: true },
    bank_name: { type: String, required: true },
    loan_amount: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    user_id: { type: String },
    documents: [
      {
        doc_type: { type: String, required: true },
        doc_no: { type: String },
        file_data: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);