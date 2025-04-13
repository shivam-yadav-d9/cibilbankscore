import axios from "axios";
import UserSecondAddress from "../models/UserSecondAddress.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = async () => {
  const { API_KEY, API_SECRET, REF_CODE } = process.env;
  const response = await axios.post("https://uat-api.evolutosolution.com/v1/authentication", {
    api_key: API_KEY,
    api_secret: API_SECRET,
    ref_code: REF_CODE,
  });
  return response.data.token;
};

export const saveUserSecondAddress = async (req, res) => {
  const data = req.body;
  try {
    const token = await generateToken();

    const apiResponse = await axios.post(
      "https://uat-api.evolutosolution.com/v1/loan/saveAddresses",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
    

    const saved = await UserSecondAddress.create(data);
    res.status(200).json({ message: "Saved to API and DB", api: apiResponse.data, db: saved });
  } catch (error) {
    console.error(" Save UserSecondAddress Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
