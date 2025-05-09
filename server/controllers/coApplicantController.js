import axios from "axios";
import CoApplicant from "../models/CoApplicant.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const REF_CODE = process.env.REF_CODE;
const API_BASE_URL = process.env.API_BASE_URL || "https://uat-api.evolutosolution.com/v1";

// Validate environment variables
const validateEnvVariables = () => {
  const requiredEnvVars = ['API_KEY', 'API_SECRET', 'REF_CODE'];
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
    
    const response = await axios.post(`${API_BASE_URL}/authentication`, {}, {
      headers: {
        'source': 'web',
        'package': '10.0.2.215',
        'outletid': REF_CODE,
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
      }
    });
    
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

    // Check if application_id exists in the request
    if (!req.body.application_id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    // First save/update to MongoDB using findOneAndUpdate with upsert option
    try {
      // Use application_id as the unique identifier
      const filter = { application_id: req.body.application_id };
      const update = {
        ...req.body,
        updated_at: new Date()
      };
      
      // Options for findOneAndUpdate - if document doesn't exist, create it
      const options = { 
        new: true, 
        upsert: true,
        runValidators: true 
      };
      
      const coApplicant = await CoApplicant.findOneAndUpdate(filter, update, options);
      console.log("Co-applicant saved/updated in MongoDB");
      
      // Try-catch block for Evoluto API interaction
      try {
        // Get authentication token
        const token = await generateToken();
        
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
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'token': token  // Add token directly in headers as well (based on error message)
            }
          }
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

    // Generic error response
    res.status(500).json({ 
      success: false,
      message: "Failed to save co-applicant information", 
      error: error.message 
    });
  }
};

// Add this function to your controller file

export const getCoApplicantByApplicationId = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }
    
    const coApplicant = await CoApplicant.findOne({ application_id: applicationId });
    
    if (!coApplicant) {
      return res.status(404).json({
        success: false,
        message: "No co-applicant found for this application ID"
      });
    }
    
    res.status(200).json({
      success: true,
      data: coApplicant
    });
  } catch (error) {
    console.error("Get Co-Applicant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve co-applicant information",
      error: error.message
    });
  }
};

