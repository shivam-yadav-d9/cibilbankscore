import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);