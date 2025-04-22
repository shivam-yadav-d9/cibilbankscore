// controllers/complaintController.js
import Complaint from "../models/complaint.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { userId, userName, complaintText, timestamp } = req.body;
    
    const newComplaint = new Complaint({
      userId,
      userName,
      complaintText,
      timestamp: timestamp || new Date()
    });
    
    await newComplaint.save();
    
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaintId: newComplaint._id
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint'
    });
  }
};

// Get all complaints (admin endpoint)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ timestamp: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints'
    });
  }
};

// Get user complaints
export const getUserComplaints = async (req, res) => {
  try {
    const { userId } = req.params;
    const complaints = await Complaint.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user complaints'
    });
  }
};

// Update complaint status (admin endpoint)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Complaint status updated',
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint'
    });
  }
};