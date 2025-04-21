// controllers/userSecondAddressController.js
import axios from "axios";
import UserSecondAddress from "../models/UserSecondAddress.js";
import dotenv from "dotenv";
dotenv.config();

export const saveUserSecondAddress = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    // First, ensure we have necessary environment variables
    const API_KEY = process.env.API_KEY || process.env.EVOLUTO_API_KEY;
    const API_SECRET = process.env.API_SECRET || process.env.EVOLUTO_API_SECRET;
    const REF_CODE = req.body.ref_code || process.env.REF_CODE || process.env.EVOLUTO_REF_CODE;
    
    // Check if we have all required values
    if (!API_KEY || !API_SECRET) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Missing API credentials" 
      });
    }
    
    if (!REF_CODE) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing ref_code in request and not configured in environment" 
      });
    }

    // Generate token
    let token;
    try {
      // Create Basic Auth token
      const credentials = `${API_KEY}:${API_SECRET}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');
      
      const tokenRes = await axios.post(
        "https://uat-api.evolutosolution.com/v1/authentication",
        {},  // Empty body
        {
          headers: { 
            'Authorization': `Basic ${base64Credentials}`,
            'source': 'web', 
            'package': '10.0.2.215', 
            'outletid': REF_CODE
          }
        }
      );

      console.log("Token response:", tokenRes.data);
      token = tokenRes.data?.data?.token;
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: "Token generation failed", 
          response: tokenRes.data 
        });
      }
    } catch (tokenError) {
      console.error("Token generation error:", tokenError.response?.data || tokenError.message);
      return res.status(tokenError.response?.status || 500).json({
        success: false,
        message: "Failed to authenticate with API",
        error: tokenError.response?.data || tokenError.message
      });
    }

    // First, save to our database
    let saved;
    
    // Check if a record with this application_id already exists
    const existingRecord = await UserSecondAddress.findOne({ 
      application_id: req.body.application_id 
    });
    
    if (existingRecord) {
      // Update existing record
      saved = await UserSecondAddress.findOneAndUpdate(
        { application_id: req.body.application_id },
        req.body,
        { new: true }
      );
    } else {
      // Create new record
      saved = await UserSecondAddress.create(req.body);
    }

    // Then, save to external API
    try {
      const apiResponse = await axios.post(
        "https://uat-api.evolutosolution.com/v1/loan/saveAddresses",
        {
          ...req.body,
          ref_code: REF_CODE // Ensure ref_code is included
        },
        {
          headers: {
            'token': token,
            'Content-Type': 'application/json',
            // 'source': 'web',
            // 'package': '10.0.2.215',
            // 'outletid': REF_CODE
          }
        }
      );
      
      console.log(apiResponse)
      res.status(200).json({ 
        success: true,
        message: "Address information saved successfully", 
        api_response: apiResponse.data, 
        db_data: saved 
      });
    } catch (apiError) {
      console.error("External API Error:", apiError.response?.data || apiError.message);
      // Still return partial success since we saved to our DB
      res.status(207).json({ 
        success: true,
        dbSuccess: true,
        apiSuccess: false,
        message: "Address saved to database, but external API call failed",
        db_data: saved,
        api_error: apiError.response?.data || apiError.message
      });
    }
  } catch (error) {
    console.error("Save UserSecondAddress Error:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to save address information",
      details: error.message 
    });
  }
  
};

export const getUserAddressesByApplicationId = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const addressData = await UserSecondAddress.findOne({ 
      application_id: applicationId 
    });

    if (!addressData) {
      return res.status(404).json({ 
        success: false,
        message: "No address information found for this application ID" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: addressData
    });
  } catch (error) {
    console.error("Get UserSecondAddress Error:", error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};