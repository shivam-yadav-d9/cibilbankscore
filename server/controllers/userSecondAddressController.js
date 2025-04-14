// controllers/userSecondAddressController.js
import axios from "axios";
import UserSecondAddress from "../models/UserSecondAddress.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = async () => {
  try {
    const response = await axios.post(
      "https://uat-api.evolutosolution.com/v1/authentication", 
      {}, 
      {
        headers: { 
          'source': 'web', 
          'package': '10.0.2.215', 
          'outletid': 'OUI202590898', 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data.token;
  } catch (error) {
    console.error("Token generation error:", error.response?.data || error.message);
    throw new Error("Failed to generate authentication token");
  }
};

export const saveUserSecondAddress = async (req, res) => {
  const data = req.body;
  
  try {
    // First, save to our database
    let saved;
    
    // Check if a record with this application_id already exists
    const existingRecord = await UserSecondAddress.findOne({ 
      application_id: data.application_id 
    });
    
    if (existingRecord) {
      // Update existing record
      saved = await UserSecondAddress.findOneAndUpdate(
        { application_id: data.application_id },
        data,
        { new: true } // Return the updated document
      );
    } else {
      // Create new record
      saved = await UserSecondAddress.create(data);
    }

    // Then, save to external API
    try {
      const token = await generateToken();
      
      const apiResponse = await axios.post(
        "https://uat-api.evolutosolution.com/v1/loan/saveAddresses",
        data,
        {
          headers: {
            'source': 'web', 
            'package': '10.0.2.215', 
            'outletid': 'OUI202590898',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      res.status(200).json({ 
        message: "Address information saved successfully", 
        api: apiResponse.data, 
        db: saved 
      });
    } catch (apiError) {
      console.error("External API Error:", apiError.message);
      // Still return success since we saved to our DB
      res.status(200).json({ 
        message: "Address saved to database, but external API call failed",
        db: saved,
        apiError: apiError.message
      });
    }
  } catch (error) {
    console.error("Save UserSecondAddress Error:", error.message);
    res.status(500).json({ 
      error: "Failed to save address information",
      details: error.message 
    });
  }
};

// Add a function to retrieve addresses by application ID
// export const getUserAddressesByApplicationId = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
    
//     const addressData = await UserSecondAddress.findOne({ 
//       application_id: applicationId 
//     });
//     console.log(addressData)
//     if (!addressData) {
//       return res.status(404).json({ message: "No address information found for this application ID" });
//     }
    
//     res.status(200).json(addressData);
//   } catch (error) {
//     console.error("Get UserSecondAddress Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };