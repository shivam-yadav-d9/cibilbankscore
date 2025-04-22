import axios from 'axios';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const BASE_URL = process.env.BASE_URL || "https://uat-api.evolutosolution.com/v1";  // Use environment variable or default

// Function to get API token
// Function to get API token
export const fetchToken = async (req, res) => {
    try {
        // Create the Authorization header using your API key and secret from environment variables
        const apiKey = process.env.EVOLUTO_API_KEY;
        const apiSecret = process.env.EVOLUTO_API_SECRET;
        
        if (!apiKey || !apiSecret) {
            return res.status(400).json({
                success: false,
                message: "API Key and Secret are not configured"
            });
        }

        // Use the pre-encoded basic auth string from your env
        const basicAuth = process.env.EVOLUTO_AUTH_BASIC;
        
        const response = await axios({
            method: "post",
            maxBodyLength: Infinity,
            url: `${BASE_URL}/authentication`,
            headers: {
                source: "web",
                package: "10.0.2.215",
                outletid: process.env.EVOLUTO_REF_CODE || "OUI202590898",
                "Authorization": `Basic ${basicAuth}`
            },
        });

        if (response.data && response.data.data && response.data.data.token) {
            res.json({ success: true, token: response.data.data.token });
        } else {
            res.status(400).json({ success: false, message: "Failed to get API token: No token in response" });
        }
    } catch (err) {
        console.error("Token fetch error:", err);
        res.status(500).json({ 
            success: false, 
            message: `Authentication failed: ${err.response?.data?.message || err.message}`
        });
    }
};

// Function to check eligibility
export const checkEligibility = async (req, res) => {
    try {
        const apiToken = req.headers.token;

        if (!apiToken) {
            return res.status(400).json({ success: false, message: "API token is required." });
        }

        const eligibilityData = req.body;

        const config = {
            method: "post",
            url: `${BASE_URL}/loan/checkEligibility`,
            headers: {
                token: apiToken,
                "Content-Type": "application/json",
            },
            data: eligibilityData,
        };

        const response = await axios.request(config);
        res.json(response.data);
    } catch (err) {
        console.error("Eligibility check error:", err);
        res.status(500).json({ success: false, message: err.response?.data?.message || "Failed to check eligibility" });
    }
};