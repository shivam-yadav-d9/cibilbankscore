import ExpertConnect from '../models/ExpertConnect.js';

export const submitComplaint = async (req, res) => {
  try {
    const { name, mobile, complaintText } = req.body;

    if (!name || !mobile || !complaintText) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const complaint = new ExpertConnect({ name, mobile, complaintText });
    await complaint.save();

    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};