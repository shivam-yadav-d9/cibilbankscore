import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getLoanStatus = async (req, res) => {
  const { loan_application_id } = req.body;

  if (!loan_application_id) {
    return res.status(400).json({ success: false, message: 'Loan Application ID is required' });
  }

  try {
    // Step 1: Generate Token
    const authResponse = await axios.post(process.env.EVOLUTO_AUTH_URL, {
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      ref_code: process.env.REF_CODE,
    });

    const token = authResponse.data?.data?.token;
    if (!token) {
      return res.status(500).json({ success: false, message: 'Failed to get token' });
    }

    // Step 2: Get Loan Status
    const statusResponse = await axios({
      method: 'get',
      url: process.env.API_LOAN_STATUS_URL,
      headers: {
        token: token,
        'Content-Type': 'application/json',
      },
      data: {
        loan_application_id: loan_application_id,
        ref_code: process.env.REF_CODE,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Loan status fetched successfully',
      data: statusResponse.data.data,
    });

  } catch (error) {
    console.error('Error fetching loan status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.response?.data || error.message,
    });
  }
};
