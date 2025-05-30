import UserReference from "../models/UserReference.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.API_BASE_URL || "https://api.evolutosolution.com/v1";

export const saveUserReferences = async (req, res) => {
  try {
    
    const apiToken = req.headers.token;

    if (!apiToken) {
      return res.status(400).json({ success: false, message: "API token is required." });
    }

    // Validate request body
    const { application_id, reference1, reference2, userId, userType } = req.body;
    
    if (!reference1?.name || !reference1?.relationship || !reference1?.email || !reference1?.phone ||
        !reference2?.name || !reference2?.relationship || !reference2?.email || !reference2?.phone ||
        !userId || !userType) {
      return res.status(400).json({ success: false, message: "Missing required information" });
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
    
    // Save to MongoDB first
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
    
    // Make request to Evoluto API (similar to checkEligibility pattern)
    try {
      const config = {
        method: "post",
        url: `${BASE_URL}/loan/saveRefrences`,
        headers: {
          token: apiToken,
          "Content-Type": "application/json",
          outletid: process.env.REF_CODE
        },
        data: dataToSave
      };

      const response = await axios(config);
      
      console.log("Data saved to Evoluto API:", response.data);
      
      return res.status(200).json({ 
        success: true,
        message: "References saved successfully to database and external API",
        mongoData: savedData,
        apiResponse: response.data
      });
    } catch (apiError) {
      console.error("Error saving to Evoluto API:", apiError.response?.data || apiError.message);
      
      return res.status(200).json({
        success: true,
        message: "References saved successfully to database, but external API save failed",
        mongoData: savedData,
        apiError: apiError.response?.data?.message || apiError.message
      });
    }
  } catch (err) {
    console.error("Error in saveUserReferences:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to save user references", 
      details: err.message 
    });
  }
};

// Get user references by application_id
export const getUserReferencesByApplicationId = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    if (!application_id) {
      return res.status(400).json({ success: false, message: "Application ID is required" });
    }
    
    const userReferences = await UserReference.findOne({ application_id });
    
    if (!userReferences) {
      return res.status(404).json({ success: false, message: "No references found for this application ID" });
    }
    
    return res.status(200).json({ success: true, data: userReferences });
  } catch (err) {
    console.error("Error fetching user references:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch user references" });
  }
};