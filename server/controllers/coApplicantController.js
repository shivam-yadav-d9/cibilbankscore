import axios from "axios";
import CoApplicant from "../models/CoApplicant.js";

const API_KEY = process.env.EVOLUTO_API_KEY;
const API_SECRET = process.env.EVOLUTO_API_SECRET;
const REF_CODE = process.env.EVOLUTO_REF_CODE;


const generateToken = async () => {
  const response = await axios.post("https://uat-api.evolutosolution.com/v1/authentication", {
    api_key: API_KEY,
    api_secret: API_SECRET,
    ref_code: REF_CODE
  });
  return response.data.data.token;
};

export const saveCoApplicant = async (req, res) => {
  try {
    const token = await generateToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Call Evoluto API
    const response = await axios.post(
      "https://uat-api.evolutosolution.com/v1/loan/saveCoApplicant",
      req.body,
      { headers }
    );

    // Save to MongoDB
    const coApp = new CoApplicant(req.body);
    await coApp.save();

    res.status(200).json({ message: "Saved to Evoluto and MongoDB", data: response.data });
  } catch (error) {
    console.error("Save Co-Applicant Error:", error.message);
    res.status(500).json({ message: "Failed to save co-applicant", error: error.message });
  }
};
