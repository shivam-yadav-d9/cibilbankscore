import axios from "axios";
import UserPreviousLoan from "../models/UserPreviousLoan.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = async () => {
  const { EVOLUTO_API_KEY, EVOLUTO_API_SECRET } = process.env;
  const response = await axios.post("https://uat-api.evolutosolution.com/v1/authentication", {
    api_key: EVOLUTO_API_KEY,
    api_secret: EVOLUTO_API_SECRET
  });
  return response.data.data.token;
};

export const saveUserPreviousLoans = async (req, res) => {
  try {
    const token = await generateToken();
    const loanData = req.body;

    const response = await axios.post(
      "https://uat-api.evolutosolution.com/v1/loan/previousLoans",
      loanData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const newLoan = new UserPreviousLoan({
      ...loanData,
      evolutoResponse: response.data.data
    });

    await newLoan.save();

    res.status(200).json({
      success: true,
      message: "Previous loans saved successfully",
      data: response.data.data
    });
  } catch (error) {
    console.error("Error saving previous loans:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
