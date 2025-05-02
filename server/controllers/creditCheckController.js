import axios from "axios";
import CreditCheck from "../models/CreditCheck.js";

const EVOLUTO_AUTH_URL = process.env.EVOLUTO_AUTH_URL // e.g., Evoluto or your provider
const CREDIT_CHECK_AUTH_URL = process.env.CREDIT_CHECK_AUTH_URL;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const REF_CODE = process.env.REF_CODE;

export const checkCredit = async (req, res) => {
  try {
    const { fname, lname, phone, pan_no, dob, ref_code } = req.body;
    if (!fname || !lname || !phone || !pan_no || !dob) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // DEV MODE: Return mock data
    if (process.env.NODE_ENV === "development" && (!API_KEY || !API_SECRET)) {
      const mockResult = {
        success: true,
        data: {
          score: Math.floor(Math.random() * 900) + 100,
          name: `${fname} ${lname}`,
        },
        message: "Mock credit score generated (DEV MODE)",
      };
      const saved = await CreditCheck.create({ ...req.body, result: mockResult });
      return res.status(200).json(mockResult);
    }

    // PRODUCTION: Get token, then check credit
    const basicAuthToken = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
    const tokenResp = await axios.post(
      CREDIT_CHECK_AUTH_URL,
      {},
      { headers: { Authorization: `Basic ${basicAuthToken}` } }
    );
    const token = tokenResp.data?.data?.token;
    if (!token) throw new Error("Failed to get credit check token");

    // Prepare payload for credit check
    const payload = {
      fname, lname, phone, pan_no, dob, ref_code: ref_code || REF_CODE,
    };

    const creditResp = await axios.post(
      EVOLUTO_AUTH_URL,
      payload,
      { headers: { token, "Content-Type": "application/json" } }
    );

    const result = creditResp.data;
    await CreditCheck.create({ ...payload, result });

    res.status(200).json(result);
  } catch (error) {
    console.error("Credit check error:", error);
    res.status(500).json({ message: error.message || "Credit check failed" });
  }
};