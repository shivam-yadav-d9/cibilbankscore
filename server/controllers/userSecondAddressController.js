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

        // Validate required fields
        const requiredFields = ['application_id', 'userId', 'userType'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate addresses structure
        if (!req.body.addresses || typeof req.body.addresses !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid addresses object"
            });
        }

        // Function to validate and clean address data
        const validateAndCleanAddress = (address, addressType) => {
            if (!address || typeof address !== 'object') {
                throw new Error(`${addressType} is missing or invalid`);
            }

            const cleaned = {
                address_line1: address.address_line1?.toString().trim() || '',
                address_line2: address.address_line2?.toString().trim() || '',
                address_line3: address.address_line3?.toString().trim() || '',
                pincode: address.pincode?.toString().trim() || '',
                state: address.state?.toString().trim() || '',
                city: address.city?.toString().trim() || '',
                landmark: address.landmark?.toString().trim() || '',
                email: address.email?.toString().trim() || '',
                phone: address.phone?.toString().trim() || ''
            };

            // Validate required address fields
            const requiredAddressFields = ['address_line1', 'pincode', 'state', 'city'];
            const missingAddressFields = requiredAddressFields.filter(field => !cleaned[field]);
            
            if (missingAddressFields.length > 0) {
                throw new Error(`${addressType} missing required fields: ${missingAddressFields.join(', ')}`);
            }

            // Validate pincode format (should be 6 digits)
            if (!/^\d{6}$/.test(cleaned.pincode)) {
                throw new Error(`${addressType} pincode must be 6 digits`);
            }

            // Validate email format if provided
            if (cleaned.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
                throw new Error(`${addressType} has invalid email format`);
            }

            // Validate phone format if provided
            if (cleaned.phone && !/^\d{10}$/.test(cleaned.phone)) {
                throw new Error(`${addressType} phone must be 10 digits`);
            }

            return cleaned;
        };

        // Validate and clean all addresses
        let cleanedAddresses;
        try {
            cleanedAddresses = {
                present_address: validateAndCleanAddress(req.body.addresses.present_address, 'Present address'),
                permanent_address: validateAndCleanAddress(req.body.addresses.permanent_address, 'Permanent address'),
                office_address: validateAndCleanAddress(req.body.addresses.office_address, 'Office address')
            };
        } catch (validationError) {
            return res.status(400).json({
                success: false,
                message: `Address validation error: ${validationError.message}`
            });
        }

        // Clean numeric fields
        const cleanNumericField = (value, fieldName) => {
            if (value === undefined || value === null || value === '') return undefined;
            
            const cleaned = value.toString().replace(/[^0-9.]/g, '');
            const parsed = parseFloat(cleaned);
            
            if (isNaN(parsed)) {
                console.warn(`Invalid ${fieldName}: '${value}' - setting to undefined`);
                return undefined;
            }
            
            return parsed;
        };

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

        // Prepare data for database (with nested addresses structure)
        const restructuredData = {
            ...req.body,
            ref_code: REF_CODE,
            addresses: cleanedAddresses,
            years_of_residence: cleanNumericField(req.body.years_of_residence, 'years_of_residence'),
            monthly_rent: cleanNumericField(req.body.monthly_rent, 'monthly_rent'),
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

        // Prepare data for external API
        const apiPayload = {
            application_id: req.body.application_id,
            userId: req.body.userId,
            userType: req.body.userType,
            ref_code: REF_CODE,
            years_of_residence: cleanNumericField(req.body.years_of_residence, 'years_of_residence'),
            residential_status: req.body.residential_status?.toString().trim() || '',
            residence_type: req.body.residence_type?.toString().trim() || '',
            monthly_rent: cleanNumericField(req.body.monthly_rent, 'monthly_rent'),
            addresses: cleanedAddresses
        };

        // Remove undefined fields from payload
        Object.keys(apiPayload).forEach(key => {
            if (apiPayload[key] === undefined) {
                delete apiPayload[key];
            }
        });

        console.log("API Payload being sent:", JSON.stringify(apiPayload, null, 2));

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
                    timeout: 30000,
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
            console.error("External API Error Details:", {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
                message: apiError.message,
                config: {
                    url: apiError.config?.url,
                    method: apiError.config?.method,
                    headers: apiError.config?.headers
                }
            });

            // Log the exact payload that failed
            console.error("Failed API Payload:", JSON.stringify(apiPayload, null, 2));
            
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
                    payload_sent: apiPayload
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

// export const getUserAddressesByApplicationId = async (req, res) => {
//     try {
//         const { applicationId } = req.params;

//         if (!applicationId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Application ID is required",
//             });
//         }

//         const addressData = await AddressDetails.findOne({
//             application_id: applicationId,
//         });

//         if (!addressData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No address information found for this application ID",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: addressData,
//         });
//     } catch (error) {
//         console.error("Get UserSecondAddress Error:", error.message);
//         res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
// };