import axios from "axios";
import AddressDetails from "../models/UserSecondAddress.js";
import dotenv from "dotenv";
dotenv.config();

export const saveUserSecondAddress = async (req, res) => {
    try {
        console.log("Incoming data:", req.body);

        const API_KEY = process.env.API_KEY;
        const API_SECRET = process.env.API_SECRET;
        const REF_CODE = req.body.ref_code || process.env.REF_CODE;

        if (!API_KEY || !API_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error: Missing API credentials",
            });
        }

        if (!REF_CODE) {
            return res.status(400).json({
                success: false,
                message: "Missing ref_code in request and not configured in environment",
            });
        }

        let token;
        try {
            const credentials = `${API_KEY}:${API_SECRET}`;
            const base64Credentials = Buffer.from(credentials).toString('base64');

            const tokenRes = await axios.post(
                "https://uat-api.evolutosolution.com/v1/authentication",
                {},
                {
                    headers: {
                        'Authorization': `Basic ${base64Credentials}`,
                        'source': 'web',
                        'package': '10.0.2.215',
                        'outletid': REF_CODE,
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

        const restructuredData = {
            ...req.body,
            addresses: {
                present_address: req.body.present_address,
                permanent_address: req.body.permanent_address,
                office_address: req.body.office_address,
            },
        };

        delete restructuredData.present_address;
        delete restructuredData.permanent_address;
        delete restructuredData.office_address;

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

        try {
            const apiResponse = await axios.post(
                "https://uat-api.evolutosolution.com/v1/loan/saveAddresses",
                {
                    ...req.body,
                    ref_code: REF_CODE,
                },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(apiResponse);
            res.status(200).json({
                success: true,
                message: "Address information saved successfully",
                api_response: apiResponse.data,
                db_data: saved,
            });
        } catch (apiError) {
            console.error("External API Error:", apiError.response?.data || apiError.message);
            res.status(207).json({
                success: true,
                dbSuccess: true,
                apiSuccess: false,
                message: "Address saved to database, but external API call failed",
                db_data: saved,
                api_error: apiError.response?.data || apiError.message,
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