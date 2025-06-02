// controllers/creditScoreController.js
import axios from "axios";
import dotenv from "dotenv";
import CreditScore from "../models/CreditCheck.js";

dotenv.config();

export const checkCreditScore = async (req, res) => {
  const { fname, lname, phone, pan_no, dob, ref_code } = req.body;

  try {
    // Step 1: Get Auth Token
    const authResponse = await axios.post(
      process.env.EVOLUTO_AUTH_URL,
      {},
      {
        headers: {
          'source': 'web',
          'package': '10.0.2.215',
          'outletid': process.env.REF_CODE,
          'Authorization': `Basic ${process.env.EVOLUTO_AUTH_BASIC}`
        }
      }
    );

    const token = authResponse.data.token;

    // Step 2: Call Credit Score API
    const creditResponse = await axios.post(
      `${process.env.API_BASE_URL}/loan/checkCreditScore`,
      { ref_code, fname, lname, phone, pan_no, dob },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = creditResponse.data;

    // Step 3: Save to MongoDB
    const saved = new CreditScore({
      ref_code,
      fname,
      lname,
      phone,
      pan_no,
      dob,
      credit_score: responseData?.data?.credit_score || null,
      status: responseData?.status,
      message: responseData?.message
    });

    await saved.save();

    res.status(200).json({
      success: true,
      message: "Credit score fetched successfully",
      data: responseData.data
    });

  } catch (error) {
    console.error("Credit Score Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch credit score",
      error: error.response?.data || error.message
    });
  }
};
// controllers/creditScoreController.js
export const getCibilScoreByPhone = async (req, res) => {
  const { number } = req.query;
  console.log("🔍 Phone number received for CIBIL check:", number);

  try {
    const existingScore = await CreditScore.findOne({ phone: number }).sort({ createdAt: -1 });

    if (!existingScore) {
      console.log("❌ No score found for:", number);
      return res.status(404).json({ success: false, message: "No CIBIL score found for this number" });
    }

    res.status(200).json({
      success: true,
      message: "CIBIL score fetched from database",
      data: existingScore,
    });
  } catch (error) {
    console.error("Fetch DB Score Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching score",
      error: error.message,
    });
  }
};

