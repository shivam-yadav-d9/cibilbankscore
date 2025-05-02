import axios from "axios";
import UserAddressModel from "../models/UserAddress.js";

export const saveUserAddress = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    // First, ensure we have necessary environment variables
    const API_KEY = process.env.API_KEY;
    const API_SECRET = process.env.API_SECRET;
    const REF_CODE = req.body.ref_code || process.env.REF_CODE;
    
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

    // Prepare request body with required fields - ensure ref_code is included
    const requestBody = {
      ref_code: REF_CODE,
      ...req.body, // This will override ref_code if provided in the body
    };

    // Validate required fields based on the example
    const requiredFields = ["first_name", "sur_name", "gender"];
    const missingFields = requiredFields.filter(field => !requestBody[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Format specific fields that the API needs differently, but keep as strings
    // This specifically addresses the validation.numeric error while keeping values as strings
    if (requestBody.salary_bank_account !== undefined) {
      const cleanValue = requestBody.salary_bank_account.toString().replace(/[^0-9.]/g, '');
      requestBody.salary_bank_account = parseFloat(cleanValue);
    }
    
    if (requestBody.tenure !== undefined) {
      const cleanValue = requestBody.tenure.toString().replace(/[^0-9.]/g, '');
      requestBody.tenure = parseFloat(cleanValue);
    }

    // Call external API
    let externalResponse;
    try {
      externalResponse = await axios.post(
        "https://uat-api.evolutosolution.com/v1/loan/saveApplicant",
        requestBody,
        {
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log("External API response:", externalResponse.data);
    } catch (apiError) {
      console.error("External API error:", apiError.response?.data || apiError.message);
      
      // Check if the error contains validation errors
      if (apiError.response?.data?.data) {
        return res.status(400).json({
          success: false,
          message: "Validation error in API request",
          validationErrors: apiError.response.data.data,
          error: apiError.response.data
        });
      }
      
      return res.status(apiError.response?.status || 500).json({ 
        success: false, 
        message: "External API error",
        error: apiError.response?.data || apiError.message
      });
    }

    // Save to your database
    try {
      const dataToSave = {
        ...requestBody,
        api_response: externalResponse.data
      };
      
      const saved = await UserAddressModel.create(dataToSave);
      res.status(200).json({ 
        success: true, 
        data: saved,
        apiResponse: externalResponse.data
      });
    } catch (dbError) {
      console.error("Database save error:", dbError);
      
      // If API call was successful but DB save failed, return partial success
      res.status(207).json({ 
        success: true, 
        apiSuccess: true,
        dbSuccess: false,
        message: "API call succeeded but database save failed",
        apiResponse: externalResponse.data,
        dbError: dbError.message 
      });
    }
  } catch (err) {
    console.error("❌ Save User Address Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};