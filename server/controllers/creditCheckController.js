import axios from "axios";
import dotenv from "dotenv";
import CreditScore from "../models/CreditCheck.js";

dotenv.config();

const BASE_URL = process.env.API_BASE_URL;

let cachedToken = null;
let tokenExpiry = null;

export const fetchToken = async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const apiSecret = process.env.API_SECRET;
        
        if (!apiKey || !apiSecret) {
            return res.status(400).json({
                success: false,
                message: "API Key and Secret are not configured"
            });
        }

        const basicAuth = process.env.EVOLUTO_AUTH_BASIC;
        
        const response = await axios({
            method: "post",
            maxBodyLength: Infinity,
            url: `${BASE_URL}/authentication`,
            headers: {
                source: "web",
                package: "10.0.2.215",
                outletid: process.env.REF_CODE,
                "Authorization": `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data && response.data.data && response.data.data.token) {
            const token = response.data.data.token;
            const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            tokenExpiry = decodedToken.exp * 1000;
            cachedToken = token;
            
            res.json({ success: true, token: token });
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

const getValidToken = async () => {
    const currentTime = Date.now();
    if (cachedToken && tokenExpiry && currentTime < tokenExpiry) {
        return cachedToken;
    }
    throw new Error("Token not available. Please fetch a new token.");
};

export const checkCreditScore = async (req, res) => {
    const { fname, lname, phone, pan_no, dob, ref_code } = req.body;
    const apiToken = req.headers.token;

    try {
        if (!apiToken) {
            return res.status(400).json({ success: false, message: "API token is required." });
        }

        const existingScore = await CreditScore.findOne({ phone }).sort({ createdAt: -1 });
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        if (existingScore && existingScore.createdAt >= oneMonthAgo && existingScore.credit_score) {
            return res.status(200).json({
                success: true,
                message: "Credit score fetched from cache.",
                data: {
                    success: true,
                    message: "Success",
                    statusCode: 200,
                    data: {
                        name: `${existingScore.fname} ${existingScore.lname}`,
                        score: existingScore.credit_score,
                    },
                },
            });
        }

        let creditResponse;
        try {
            creditResponse = await axios.post(
                `${BASE_URL}/loan/checkCreditScore`,
                { ref_code, fname, lname, phone, pan_no, dob },
                {
                    headers: {
                        token: apiToken,
                        "Content-Type": "application/json",
                        source: "web",
                        package: "10.0.215",
                        outletid: process.env.REF_CODE,
                    },
                }
            );
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch credit score from API");
        }

        const responseData = creditResponse.data;

        const saved = new CreditScore({
            ref_code,
            fname,
            lname,
            phone,
            pan_no,
            dob,
            credit_score: responseData?.data?.score || null,
            status: responseData?.statusCode,
            message: responseData?.message,
        });

        await saved.save();

        res.status(200).json({
            success: true,
            message: "Credit score successfully fetched",
            data: responseData,
        });
    } catch (error) {
        console.error("Credit Score Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch credit score",
            error: error.message,
        });
    }
};

export const getCreditScoreByPhone = async (req, res) => {
    const { number } = req.query;

    try {
        const existingScore = await CreditScore.findOne({ phone: number }).sort({ createdAt: -1 });

        if (!existingScore) {
            return res.status(404).json({ success: false, message: "No credit score found for this number" });
        }

        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        if (existingScore.createdAt < oneMonthAgo) {
            return res.status(403).json({
                success: false,
                message: "Credit score expired. Please re-check to generate a new score.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Credit score fetched successfully from database",
            data: existingScore,
        });
    } catch (error) {
        console.error("Fetch DB Score Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching score",
            error: error.message,
        });
    }
};