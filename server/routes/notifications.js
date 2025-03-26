import express from "express";
const router = express.Router();
import Notification from "../models/Notification.js";

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch("/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    const updatedNotification = await notification.save();

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification
router.delete("/:id", async (req, res) => {
  try {
    const result = await Notification.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear all notifications
router.delete("/", async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
