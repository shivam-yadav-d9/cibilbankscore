import axios from "axios";
import LoanApplication from "../models/LoanApplication.js";

let data = JSON.stringify({
  "ref_code": "OUI202590898",
  "name": "Mahesh Waghmare",
  "mobile": "9370643086",
  "email": "maheshwagh23@gmail.com",
  "dob": "1982-06-03",
  "city": "Nagpur",
  "pincode": "440034",
  "income_source": 1,
  "monthly_income": "150000",
  "loan_amount": "100000",
  "pan": "ABSPW8730C",
  "aadhaar": "860682688230",
  "loan_type_id": "60",
  "preferred_banks": "[1,2]"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://uat-api.evolutosolution.com/v1/loan/storeBasicDetails',
  headers: { 
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODk4OTgsIm5hbWUiOiJMb2tlc2giLCJlbWFpbCI6ImluZm9AZGJucGUuaW4iLCJyb2xlIjoyLCJhY2Nlc3Nfcm9sZXMiOltdLCJjcmVkaXRfc2NvcmVfcGVybWlzc2lvbiI6MSwiZXhwIjoxNzQ0Mzc3MTU1fQ.FAtiWggQlSgm39Yqkr4WwectQhKAbggRh9TkllyoAzo', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});



const EVOLUTO_AUTH_URL = "https://uat-api.evolutosolution.com/v1/authentication";
const STORE_DETAILS_URL = "https://uat-api.evolutosolution.com/v1/loan/storeBasicDetails";

const API_KEY = process.env.EVOLUTO_API_KEY;
const API_SECRET = process.env.EVOLUTO_API_SECRET;
const REF_CODE = process.env.EVOLUTO_REF_CODE;

export const storeLoanDetails = async (req, res) => {
  try {
    const requiredFields = ["name", "mobile", "email", "dob", "pan", "loan_type_id", "income_source", "monthly_income", "loan_amount"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    if (!API_KEY || !API_SECRET || !REF_CODE) {
      return res.status(500).json({ message: "Missing API credentials or REF_CODE in environment variables." });
    }

    const userData = {
      ...req.body,
      ref_code: REF_CODE,
    };

    console.log("✅ User Data to send:", userData);
    console.log("🔑 API_KEY:", API_KEY);
    console.log("🔐 API_SECRET:", API_SECRET);
    console.log("🏬 REF_CODE (used as outletid):", REF_CODE);

    // ✅ Requesting token.  The body *may* need apiKey and apiSecret. Contact Evoluto to confirm!
    const tokenResponse = await axios.post(
      EVOLUTO_AUTH_URL,
      {},
      {
        headers: {
          "X-API-KEY": API_KEY, // Example: different key
          "X-API-SECRET": API_SECRET, // Example: different key
          source: "web",
          package: "10.0.2.215",
          outletid: REF_CODE,
          //Authorization: `${API_KEY}:${API_SECRET}`,  // REMOVE THIS LINE!
        },
      }
    );

    const token = tokenResponse.data?.data?.token;
    console.log(token)
    if (!token) {
      console.error("Evoluto Auth Response:", tokenResponse.data);
      throw new Error("Failed to generate token from Evoluto");
    }

    const evolutoResponse = await axios.post(STORE_DETAILS_URL, userData, {
      headers: {
        token: token,
        "Content-Type": "application/json",
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
        return res.status(400).json({ message: "Invalid preferred_banks format.  Must be a JSON array string like '[1, 2]'" });
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