import axios from "axios";
import UserPreviousLoan from "../models/UserPreviousLoan.js";
import dotenv from "dotenv";
dotenv.config();

// Generate Evoluto token
const generateToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL || "https://uat-api.evolutosolution.com/v1"}/authentication`,
      {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      },
      {
        headers: {
          source: "web",
          package: "10.0.2.215",
          outletid: process.env.OUTLET_ID || "OUI202590898",
          Authorization: `Basic ${process.env.EVOLUTO_AUTH_BASIC}`
        }
      }
    );
    return response.data.data.token;
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Evoluto API");
  }
};

export const saveUserPreviousLoans = async (req, res) => {
  try {
    const {
      application_id,
      ref_code,
      loan_data,
      userId,
      userType
    } = req.body;

    if (
      !application_id ||
      !ref_code ||
      !loan_data ||
      !userId ||
      !userType ||
      !Array.isArray(loan_data)
    ) {
      return res.status(400).json({ error: "Missing or invalid request fields" });
    }

    // Validate loan entries
    for (const loan of loan_data) {
      if (
        !loan.loan_account_no ||
        !loan.loan_year ||
        !loan.loan_amount ||
        !loan.emi_amount ||
        !loan.product ||
        !loan.bank_name
      ) {
        return res.status(400).json({ error: "Missing required loan information" });
      }
    }

    // Strip _id if present in loan_data
    const cleanedLoanData = loan_data.map(({ loan_account_no, loan_year, loan_amount, emi_amount, product, bank_name }) => ({
      loan_account_no,
      loan_year,
      loan_amount,
      emi_amount,
      product,
      bank_name
    }));

    // Save/update to DB without evolutoResponse
    const updatedDoc = await UserPreviousLoan.findOneAndUpdate(
      { application_id },
      {
        application_id,
        ref_code,
        loan_data: cleanedLoanData,
        userId,
        userType
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    // Call Evoluto API
    try {
      const token = await generateToken();

      const evoResponse = await axios.post(
        `${process.env.API_BASE_URL || "https://uat-api.evolutosolution.com/v1"}/loan/previousLoans`,
        {
          application_id,
          ref_code,
          loan_data: cleanedLoanData
        },
        {
          headers: {
            token,
            "Content-Type": "application/json"
          }
        }
      );

      return res.status(200).json({
        message: "Previous loans saved to DB and sent to external API",
        mongoData: updatedDoc,
        apiResponse: evoResponse.data
      });
    } catch (apiError) {
      console.error("Evoluto API error:", apiError.response?.data || apiError.message);

      return res.status(200).json({
        message: "Saved to DB, but Evoluto API call failed",
        mongoData: updatedDoc,
        apiError: apiError.response?.data || apiError.message
      });
    }
  } catch (err) {
    console.error("saveUserPreviousLoans error:", err.message);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Get previous loans by application ID
export const getUserPreviousLoansByApplicationId = async (req, res) => {
  try {
    const { application_id } = req.params;

    if (!application_id) {
      return res.status(400).json({ error: "Application ID is required" });
    }

    const previousLoans = await UserPreviousLoan.findOne({ application_id }).lean();

    if (!previousLoans) {
      return res.status(404).json({ error: "No data found for this Application ID" });
    }

    return res.status(200).json({ data: previousLoans });
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Failed to fetch previous loan data" });
  }
};
