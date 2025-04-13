import axios from "axios";
import UserReference from "../models/UserReference.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = async () => {
  const response = await axios.post(`${process.env.API_BASE_URL}/authentication`, {
    api_key: process.env.EVOLUTO_API_KEY,
    api_secret: process.env.EVOLUTO_API_SECRET
  });
  return response.data.data.token;
};

export const saveUserReferences = async (req, res) => {
  try {
    const token = await generateToken();

    const evoResponse = await axios.post(
      `${process.env.API_BASE_URL}/loan/saveRefrences`,
      req.body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save to MongoDB
    const savedData = await UserReference.create(req.body);

    res.status(200).json({ message: "Saved successfully", data: savedData });
  } catch (err) {
    console.error("Save UserReferences Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to save user references" });
  }
};
