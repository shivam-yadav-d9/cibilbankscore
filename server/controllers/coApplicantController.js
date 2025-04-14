import axios from "axios";
import CoApplicant from "../models/CoApplicant.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Log environment variables for debugging (remove in production)
console.log("Environment variables check:");
console.log("EVOLUTO_API_KEY exists:", !!process.env.EVOLUTO_API_KEY);
console.log("EVOLUTO_API_SECRET exists:", !!process.env.EVOLUTO_API_SECRET);
console.log("EVOLUTO_REF_CODE exists:", !!process.env.EVOLUTO_REF_CODE);
console.log("EVOLUTO_API_BASE_URL:", process.env.EVOLUTO_API_BASE_URL);

const API_KEY = process.env.EVOLUTO_API_KEY;
const API_SECRET = process.env.EVOLUTO_API_SECRET;
const REF_CODE = process.env.EVOLUTO_REF_CODE;
const API_BASE_URL = process.env.EVOLUTO_API_BASE_URL || "https://uat-api.evolutosolution.com/v1";

// Validate environment variables
const validateEnvVariables = () => {
  const requiredEnvVars = ['EVOLUTO_API_KEY', 'EVOLUTO_API_SECRET', 'EVOLUTO_REF_CODE'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

/**
 * Generate authentication token for Evoluto API
 * @returns {Promise<string>} Authentication token
 */
const generateToken = async () => {
  try {
    console.log("Generating token for Evoluto API...");
    console.log("Using API_KEY:", API_KEY ? "Set" : "Not set");
    console.log("Using API_SECRET:", API_SECRET ? "Set" : "Not set");
    console.log("Using REF_CODE:", REF_CODE);
    console.log("Using API_BASE_URL:", API_BASE_URL);
    
    const response = await axios.post(`${API_BASE_URL}/authentication`, {}, {
      headers: {
        'source': 'web',
        'package': '10.0.2.215',
        'outletid': REF_CODE,
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      }
    });
    
    console.log("Authentication response:", response.data);
    
    if (!response.data?.data?.token) {
      throw new Error("Invalid token response from authentication API");
    }
    
    console.log("Token generated successfully");
    return response.data.data.token;
  } catch (error) {
    console.error("Token generation failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Save co-applicant data to Evoluto API and local database
 */
export const saveCoApplicant = async (req, res) => {
  try {
    // First validate environment variables
    validateEnvVariables();

    console.log("Processing co-applicant request:", req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'relationship', 'email', 'phone', 'address_line1', 'pincode', 'state', 'city', 'occupation'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(req.body.pincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 6 digits"
      });
    }

    // First save to MongoDB
    try {
      const coApplicant = new CoApplicant({
        ...req.body,
        created_at: new Date()
      });
      
      await coApplicant.save();
      console.log("Co-applicant saved to MongoDB");
      
      // Try-catch block for Evoluto API interaction
      try {
        // Get authentication token
        const token = await generateToken();
        
        // Prepare API request
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Prepare payload for Evoluto API - ensure ref_code is correct
        const evolutoPayload = {
          ...req.body,
          ref_code: REF_CODE // Use the environment variable
        };

        console.log("Sending to Evoluto API:", evolutoPayload);

        // Call Evoluto API to save co-applicant
        const evolutoResponse = await axios.post(
          `${API_BASE_URL}/loan/saveCoApplicant`,
          evolutoPayload,
          { headers }
        );

        console.log("Evoluto API response:", evolutoResponse.data);

        // Update MongoDB record with Evoluto response
        await CoApplicant.findByIdAndUpdate(coApplicant._id, {
          evoluto_response: evolutoResponse.data,
          updated_at: new Date()
        });

        // Return success response
        res.status(200).json({ 
          success: true,
          message: "Co-applicant information saved successfully", 
          data: evolutoResponse.data 
        });
      } catch (evolutoError) {
        console.error("Evoluto API Error:", evolutoError);
        
        // Even if Evoluto API fails, we can still return success since data is in MongoDB
        // But include the error information
        res.status(200).json({ 
          success: true,
          message: "Co-applicant information saved to database but Evoluto API call failed", 
          evolutoError: evolutoError.message,
          evolutoResponse: evolutoError.response?.data
        });
      }
    } catch (dbError) {
      console.error("MongoDB Error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to save to database",
        error: dbError.message
      });
    }
  } catch (error) {
    console.error("Save Co-Applicant Error:", error);
    
    // Check if it's a validation error from MongoDB
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Check if it's an Evoluto API error
    if (error.response?.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: "Evoluto API error",
        error: error.response.data
      });
    }

    // Generic error response
    res.status(500).json({ 
      success: false,
      message: "Failed to save co-applicant information", 
      error: error.message 
    });
  }
};