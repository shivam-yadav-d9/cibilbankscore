import User from "../models/usermodel.js"; // ✅ Import User model
import Profile from "../models/profilemodel.js"; // ✅ Import Profile model

// Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email createdAt"); // Fetch name, email, and createdAt
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

// Get all profile details
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile data", error });
  }
};
