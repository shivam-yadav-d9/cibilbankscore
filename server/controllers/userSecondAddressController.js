import axios from "axios";
import AddressDetails from "../models/UserSecondAddress.js";
import dotenv from "dotenv";
dotenv.config();

export const saveUserSecondAddress = async (req, res) => {
    try {
        console.log("Incoming data:", req.body);

        const API_KEY = process.env.API_KEY;
        const API_SECRET = process.env.API_SECRET;
        // Prioritize environment variable REF_CODE for production
        const REF_CODE = process.env.REF_CODE || req.body.ref_code;

        if (!API_KEY || !API_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error: Missing API credentials",
            });
        }

        if (!REF_CODE) {
            return res.status(400).json({
                success: false,
                message: "Missing ref_code in environment configuration and request",
            });
        }

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
                        'outletid': REF_CODE, // Use the production REF_CODE
                    },
                }
            );

            console.log("Token response:", tokenRes.data);
            token = tokenRes.data?.data?.token;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Token generation failed",
                    response: tokenRes.data,
                });
            }
        } catch (tokenError) {
            console.error("Token generation error:", tokenError.response?.data || tokenError.message);
            return res.status(tokenError.response?.status || 500).json({
                success: false,
                message: "Failed to authenticate with API",
                error: tokenError.response?.data || tokenError.message,
            });
        }

        let saved;

        // Prepare data for database (with nested addresses structure)
        const restructuredData = {
            ...req.body,
            ref_code: REF_CODE, // Ensure consistent ref_code (production)
            addresses: {
                present_address: req.body.present_address,
                permanent_address: req.body.permanent_address,
                office_address: req.body.office_address,
            },
        };

        // Save to database
        try {
            const existingRecord = await AddressDetails.findOne({
                application_id: req.body.application_id,
            });

            if (existingRecord) {
                saved = await AddressDetails.findOneAndUpdate(
                    { application_id: req.body.application_id },
                    restructuredData,
                    { new: true }
                );
            } else {
                saved = await AddressDetails.create(restructuredData);
            }
        } catch (dbError) {
            console.error("Database Error:", dbError.message);
            return res.status(500).json({
                success: false,
                message: "Failed to save to database",
                error: dbError.message,
            });
        }

        // Prepare data for external API (with nested addresses structure as expected by API)
        const apiPayload = {
            application_id: req.body.application_id,
            userId: req.body.userId,
            userType: req.body.userType,
            ref_code: REF_CODE, // Use the production REF_CODE
            years_of_residence: req.body.years_of_residence,
            residential_status: req.body.residential_status,
            residence_type: req.body.residence_type,
            monthly_rent: req.body.monthly_rent,
            addresses: {
                present_address: req.body.present_address,
                permanent_address: req.body.permanent_address,
                office_address: req.body.office_address,
            }
        };

        // Call external API
        try {
            const apiResponse = await axios.post(
                "https://api.evolutosolution.com/v1/loan/saveAddresses",
                apiPayload,
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000, // 30 second timeout
                }
            );

            console.log("API Response:", apiResponse.data);
            
            res.status(200).json({
                success: true,
                message: "Address information saved successfully",
                api_response: apiResponse.data,
                db_data: saved,
            });
        } catch (apiError) {
            console.error("External API Error:", {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
                message: apiError.message
            });
            
            // Return partial success - database saved but API failed
            res.status(207).json({
                success: true,
                dbSuccess: true,
                apiSuccess: false,
                message: "Address saved to database, but external API call failed",
                db_data: saved,
                api_error: {
                    status: apiError.response?.status,
                    message: apiError.response?.data || apiError.message,
                },
            });
        }
    } catch (error) {
        console.error("Save UserSecondAddress Error:", error.message);
        res.status(500).json({
            success: false,
            error: "Failed to save address information",
            details: error.message,
        });
    }
};

export const getUserAddressesByApplicationId = async (req, res) => {
    try {
        const { applicationId } = req.params;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required",
            });
        }

        const addressData = await AddressDetails.findOne({
            application_id: applicationId,
        });

        if (!addressData) {
            return res.status(404).json({
                success: false,
                message: "No address information found for this application ID",
            });
        }

        res.status(200).json({
            success: true,
            data: addressData,
        });
    } catch (error) {
        console.error("Get UserSecondAddress Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};