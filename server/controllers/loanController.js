import axios from "axios";
import LoanApplication from "../models/LoanApplication.js"; // Assuming you have this model

// Define URL constants at the top of the file
const EVOLUTO_AUTH_URL = process.env.EVOLUTO_AUTH_URL || "https://uat-api.evolutosolution.com/v1/authentication";
const STORE_DETAILS_URL = process.env.STORE_DETAILS_URL || "https://uat-api.evolutosolution.com/v1/loan/storeBasicDetails";

export const storeLoanDetails = async (req, res) => {
  try {
    const requiredFields = ["name", "mobile", "email", "dob", "pan", "loan_type_id", "income_source", "monthly_income", "loan_amount"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Use environment variables or fallback to defaults for development
    const API_KEY = process.env.EVOLUTO_API_KEY || "47e3b88954003cab3e4f518c597651be73d2d966a41f8aec7f2697b72590d6c5";
    const API_SECRET = process.env.EVOLUTO_API_SECRET || "BNRq8RMC366ClzU3X5ftP85yKInM/tDEb8gyzwv1/wmfVvpD7GTF5LrIRhSy1PEF97YXu3nsJzC3UhcrUl2TLAQMYrm0QGlQ0damxe2LEPT8sa5GIFGdMVRrC8vODtBSvt+pNjKnuiodXQHwuza1MtqK6E86mRx8K3AcAAO5FykGl4tfze9yeK3fGmgFZJ3z";
    const REF_CODE = process.env.EVOLUTO_REF_CODE || "OUI202590898";

    console.log("✅ Environment variables:");
    console.log("🔑 API_KEY:", API_KEY);
    console.log("🔐 API_SECRET:", API_SECRET);
    console.log("🏬 REF_CODE:", REF_CODE);

    // Create Basic Auth token by encoding API_KEY:API_SECRET in base64
    const basicAuthToken = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const userData = {
      ...req.body,
      ref_code: REF_CODE,
    };

    console.log("✅ User Data to send:", userData);

    // DEVELOPMENT MODE CHECK
    // For development without Evoluto API access, bypass the actual API call
    // and create a mock application ID
    if (process.env.NODE_ENV === 'development' && (!process.env.EVOLUTO_API_KEY || !process.env.EVOLUTO_API_SECRET)) {
      console.log("⚠️ Running in development mode with mock data");
      
      // Create a mock application ID
      const mockApplicationId = "DEV-" + Math.floor(Math.random() * 100000);
      
      // Handle preferred_banks - convert to array of numbers if necessary
      let preferredBanks = userData.preferred_banks;
      if (typeof userData.preferred_banks === 'string') {
        try {
          preferredBanks = JSON.parse(userData.preferred_banks);
          if (!Array.isArray(preferredBanks)) {
            throw new Error("preferred_banks must be an array");
          }
          preferredBanks = preferredBanks.map(Number); // Ensure numbers
        } catch (parseError) {
          console.error("Error parsing preferred_banks:", parseError);
          return res.status(400).json({ message: "Invalid preferred_banks format. Must be a JSON array string like '[1, 2]'" });
        }
      }

      // Save to database with mock application ID
      const savedData = new LoanApplication({
        ...userData,
        application_id: mockApplicationId,
        preferred_banks: preferredBanks,
      });
      await savedData.save();

      return res.status(200).json({
        message: "Loan details submitted and stored successfully (DEV MODE)",
        application_id: mockApplicationId,
        savedData,
      });
    }

    // PRODUCTION MODE - actual API calls
    // Request token using Basic Authentication approach
    const tokenResponse = await axios.post(
      EVOLUTO_AUTH_URL,
      {}, // Empty payload
      {
        headers: {
          'Authorization': `Basic ${basicAuthToken}`,
          'source': 'web',
          'package': '10.0.2.215',
          'outletid': REF_CODE
        },
      }
    );

    const token = tokenResponse.data?.data?.token;
    console.log("Token received:", token);
    if (!token) {
      console.error("Evoluto Auth Response:", tokenResponse.data);
      throw new Error("Failed to generate token from Evoluto");
    }

    // Format preferred_banks as a string if it's an array
    if (Array.isArray(userData.preferred_banks)) {
      userData.preferred_banks = JSON.stringify(userData.preferred_banks);
    }

    // Ensure income_source is sent as a number
    if (userData.income_source && typeof userData.income_source === 'string') {
      userData.income_source = parseInt(userData.income_source, 10);
    }

    const evolutoResponse = await axios.post(STORE_DETAILS_URL, userData, {
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      },
    });

    const applicationId = evolutoResponse.data?.data?.application_id;

    if (!applicationId) {
      console.error("Evoluto Store Details Response:", evolutoResponse.data);
      throw new Error("Evoluto response missing application_id");
    }

    // Handle preferred_banks - convert to array of numbers if necessary
    let preferredBanks = userData.preferred_banks;
    if (typeof userData.preferred_banks === 'string') {
      try {
        preferredBanks = JSON.parse(userData.preferred_banks);
        if (!Array.isArray(preferredBanks)) {
          throw new Error("preferred_banks must be an array");
        }
        preferredBanks = preferredBanks.map(Number); // Ensure numbers
      } catch (parseError) {
        console.error("Error parsing preferred_banks:", parseError);
        return res.status(400).json({ message: "Invalid preferred_banks format. Must be a JSON array string like '[1, 2]'" });
      }
    }

    const savedData = new LoanApplication({
      ...userData,
      application_id: applicationId,
      preferred_banks: preferredBanks,
    });
    await savedData.save();

    res.status(200).json({
      message: "Loan details submitted and stored successfully",
      application_id: applicationId,
      savedData,
    });

  } catch (error) {
    console.error("❌ Error submitting loan details:", error);
    if (error.response) {
      console.error("📥 Response Data:", error.response.data);
      console.error("📄 Status:", error.response.status);
      console.error("📋 Headers:", error.response.headers);
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};