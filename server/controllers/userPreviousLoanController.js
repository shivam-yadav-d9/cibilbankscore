import axios from "axios";
import UserPreviousLoan from "../models/UserPreviousLoan.js";
import dotenv from "dotenv";
dotenv.config();

// Function to generate authorization token
const generateToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL || "https://uat-api.evolutosolution.com/v1"}/authentication`,
      {
        api_key: process.env.EVOLUTO_API_KEY,
        api_secret: process.env.EVOLUTO_API_SECRET
      },
      {
        headers: {
          'source': 'web',
          'package': '10.0.2.215',
          'outletid': process.env.OUTLET_ID || 'OUI202590898',
          'Authorization': `Basic ${process.env.EVOLUTO_AUTH_BASIC}`
        }
      }
    );
    
    console.log("Authentication successful");
    return response.data.data.token;
  } catch (error) {
    console.error("Authentication error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Evoluto API");
  }
};

export const saveUserPreviousLoans = async (req, res) => {
  try {
    // Validate request body
    const { application_id, ref_code, loan_data } = req.body;
    
    if (!application_id || !ref_code || !loan_data || !Array.isArray(loan_data)) {
      return res.status(400).json({ error: "Invalid request data format" });
    }
    
    // Validate each loan entry
    for (const loan of loan_data) {
      if (!loan.loan_account_no || !loan.loan_year || !loan.loan_amount || 
          !loan.emi_amount || !loan.product || !loan.bank_name) {
        return res.status(400).json({ error: "Missing required loan information" });
      }
    }
    
    console.log("Saving user previous loans:", req.body);
    
    // First save to MongoDB
    const savedData = await UserPreviousLoan.create(req.body);
    console.log("Data saved to MongoDB:", savedData._id);
    
    try {
      // Generate authentication token
      const token = await generateToken();
      
      // Make request to Evoluto API
      const evoResponse = await axios.post(
        `${process.env.API_BASE_URL || "https://uat-api.evolutosolution.com/v1"}/loan/previousLoans`,
        req.body,
        { 
          headers: { 
            'token': token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("Data saved to Evoluto API:", evoResponse.data);
      
      // Update MongoDB document with Evoluto response
      savedData.evolutoResponse = evoResponse.data;
      await savedData.save();
      
      return res.status(200).json({ 
        message: "Previous loans saved successfully to database and external API",
        mongoData: savedData,
        apiResponse: evoResponse.data
      });
    } catch (apiError) {
      console.error("Error saving to Evoluto API:", apiError.response?.data || apiError.message);
      
      // Even if external API fails, we return success since we saved to MongoDB
      return res.status(200).json({
        message: "Previous loans saved successfully to database, but external API save failed",
        mongoData: savedData,
        apiError: apiError.response?.data || apiError.message
      });
    }
  } catch (err) {
    console.error("Error in saveUserPreviousLoans:", err.message);
    return res.status(500).json({ error: "Failed to save previous loans", details: err.message });
  }
};

// Get user previous loans by application_id
export const getUserPreviousLoansByApplicationId = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    if (!application_id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    
    const userPreviousLoans = await UserPreviousLoan.findOne({ application_id });
    
    if (!userPreviousLoans) {
      return res.status(404).json({ error: "No previous loans found for this application ID" });
    }
    
    return res.status(200).json({ data: userPreviousLoans });
  } catch (err) {
    console.error("Error fetching user previous loans:", err.message);
    return res.status(500).json({ error: "Failed to fetch user previous loans" });
  }
};