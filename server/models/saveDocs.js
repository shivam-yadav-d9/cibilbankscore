import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  application_id: {
    type: String,
    required: true,
    unique: true
  },
  documents: [{
    doc_type: {
      type: String,
      required: true,
      enum: ["PAN CARD", "AADHAAR CARD", "INCOME PROOF", "PHOTOGRAPH", "OTHER"]
    },
    doc_no: {
      type: String,
      required: true
    },
    file_name: {
      type: String,
      required: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const document = mongoose.model("document", documentSchema);

export default document;