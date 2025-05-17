import axios from "axios";
import LoanApplication from "../models/LoanApplication.js"; // Assuming you have this model

// Define URL constants at the top of the file
const EVOLUTO_AUTH_URL = process.env.EVOLUTO_AUTH_URL
const STORE_DETAILS_URL = process.env.STORE_DETAILS_URL

export const storeLoanDetails = async (req, res) => {
  try {
    const requiredFields = ["name", "mobile", "email", "dob", "pan", "loan_type_id", "income_source", "monthly_income", "loan_amount","userId", "userType"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Use environment variables or fallback to defaults for development
    const API_KEY = process.env.API_KEY;
    const API_SECRET = process.env.API_SECRET;
    const REF_CODE = process.env.REF_CODE ;

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
        appliedBy: {
          userId: req.body.userId,
          userType: req.body.userType
        }
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
      appliedBy: {
        userId: req.body.userId,
        userType: req.body.userType
      }
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


// Get loan data by email
export const getLoanDetailsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required  " });
    }

    const loanData = await LoanApplication.findOne({ email });

    if (!loanData) {
      return res.status(404).json({ message: "No Loan data found for this email" });
    }

    res.status(200).json(loanData);
  } catch (error) {
    console.error("Error fetching loan data by email:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Get loan details by userType and userId
export const getLoanDetailsByUser = async (req, res) => {
  const { userType, userId } = req.query;

  try {
    if (!userType || !userId) {
      return res.status(400).json({ message: "Both userType and userId are required." });
    }

    const loanData = await LoanApplication.find({ userType, userId });

    if (!loanData || loanData.length === 0) {
      return res.status(404).json({ message: "No loan data found for the given userType and userId." });
    }

    res.status(200).json(loanData);
  } catch (error) {
    console.error("Error fetching loan data by userType and userId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

