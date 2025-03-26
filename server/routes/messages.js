import express from "express"
const router = express.Router();
import Message from "../models/Message.js";
import Notification from "../models/Notification.js"


// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new message
router.post("/", async (req, res) => {
  const { content, sender } = req.body;

  if (!content || !sender) {
    return res.status(400).json({ message: "Content and sender are required" });
  }

  try {
    // Create message
    const message = new Message({
      content,
      sender,
    });

    const savedMessage = await message.save();

    // Create notification
    const notification = new Notification({
      message: content,
      sender,
    });

    await notification.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
