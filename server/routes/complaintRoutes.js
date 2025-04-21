// routes/complaintRoutes.js
import express from "express"
const router = express.Router();
import { createComplaint, getAllComplaints, getUserComplaints,updateComplaintStatus } from "../controllers/complaintController.js";

// Create a new complaint
router.post('/', createComplaint);

// Get all complaints (admin endpoint)
router.get('/', getAllComplaints);

// Get user complaints
router.get('/user/:userId', getUserComplaints);

// Update complaint status (admin endpoint)
router.patch('/:id', updateComplaintStatus);

export default router;