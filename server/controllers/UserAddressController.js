import axios from "axios";
import UserAddressModel from "../models/UserAddress.js";

export const saveUserAddress = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const API_KEY = process.env.API_KEY;
    const API_SECRET = process.env.API_SECRET;
    const REF_CODE = req.body.ref_code || process.env.REF_CODE;

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
      const credentials = `${API_KEY}:${API_SECRET}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');

      const tokenRes = await axios.post(
        "https://api.evolutosolution.com/v1/authentication",
        {},
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

    const requestBody = {
      ref_code: REF_CODE,
      ...req.body,
    };

    const requiredFields = ["first_name", "sur_name", "gender"];
    const missingFields = requiredFields.filter(field => !requestBody[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (requestBody.salary_bank_account !== undefined) {
      const cleanValue = requestBody.salary_bank_account.toString().replace(/[^0-9.]/g, '');
      requestBody.salary_bank_account = parseFloat(cleanValue);
    }

    if (requestBody.tenure !== undefined) {
      const cleanValue = requestBody.tenure.toString().replace(/[^0-9.]/g, '');
      requestBody.tenure = parseFloat(cleanValue);
    }

    let externalResponse;
    try {
      externalResponse = await axios.post(
        "https://api.evolutosolution.com/v1/loan/saveApplicant",
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

    // ✅ Extract userId and userType from API response
    const { userId, userType } = externalResponse.data.data;

    try {
      const dataToSave = {
        ...requestBody,
        userId,
        userType,
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
