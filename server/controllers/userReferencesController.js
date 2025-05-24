import UserReference from "../models/UserReference.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Function to generate authorization token
const generateToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL || "https://api.evolutosolution.com/v1"}/authentication`,
      {
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      },
      {
        headers: {
          'source': 'web',
          'package': '10.0.2.215',
          'outletid': process.env.REF_CODE,
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

export const saveUserReferences = async (req, res) => {
  try {
    // Validate request body
    const { application_id, reference1, reference2, userId, userType } = req.body;
    
    if (!reference1?.name || !reference1?.relationship || !reference1?.email || !reference1?.phone ||
        !reference2?.name || !reference2?.relationship || !reference2?.email || !reference2?.phone ||
        !userId || !userType) {
      return res.status(400).json({ error: "Missing required information" });
    }
    
    // Use production REF_CODE from environment
    const productionRefCode = process.env.REF_CODE;
    
    // Prepare data with production ref_code
    const dataToSave = {
      application_id,
      ref_code: productionRefCode,
      reference1,
      reference2,
      userId,
      userType
    };
    
    console.log("Saving user references with production ref_code:", dataToSave);
    
    // Use findOneAndUpdate with upsert option instead of create
    const savedData = await UserReference.findOneAndUpdate(
      { application_id }, // filter criteria
      dataToSave, 
      { 
        new: true, // return the updated document
        upsert: true, // create if it doesn't exist
        runValidators: true // run schema validators on update
      }
    );
    
    console.log("Data saved to MongoDB:", savedData._id);
    
    // Rest of your code remains the same
    try {
      // Generate authentication token
      const token = await generateToken();
      
      // Make request to Evoluto API with production ref_code
      const evoResponse = await axios.post(
        `${process.env.API_BASE_URL || "https://api.evolutosolution.com/v1"}/loan/saveRefrences`,
        dataToSave, // Using dataToSave which has production ref_code
        { 
          headers: { 
            'token': token,
            'Content-Type': 'application/json',
            'outletid': process.env.REF_CODE,
          } 
        }
      );
      
      console.log("Data saved to Evoluto API:", evoResponse.data);
      
      return res.status(200).json({ 
        message: "References saved successfully to database and external API",
        mongoData: savedData,
        apiResponse: evoResponse.data
      });
    } catch (apiError) {
      console.error("Error saving to Evoluto API:", apiError.response?.data || apiError.message);
      
      return res.status(200).json({
        message: "References saved successfully to database, but external API save failed",
        mongoData: savedData,
        apiError: apiError.response?.data || apiError.message
      });
    }
  } catch (err) {
    console.error("Error in saveUserReferences:", err.message);
    return res.status(500).json({ error: "Failed to save user references", details: err.message });
  }
};

// Get user references by application_id
export const getUserReferencesByApplicationId = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    if (!application_id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    
    const userReferences = await UserReference.findOne({ application_id });
    
    if (!userReferences) {
      return res.status(404).json({ error: "No references found for this application ID" });
    }
    
    return res.status(200).json({ data: userReferences });
  } catch (err) {
    console.error("Error fetching user references:", err.message);
    return res.status(500).json({ error: "Failed to fetch user references" });
  }
};