import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const authenticateEvoluto = async () => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.EVOLUTO_AUTH_URL,
      headers: {
        source: 'web',
        package: '10.0.2.215',
        outletid: process.env.REF_CODE,
        Authorization: `Basic ${process.env.EVOLUTO_AUTH_BASIC}`,
      },
    };

    const response = await axios.request(config);
    if (response.data && response.data.token) {
      return response.data.token;
    } else {
      throw new Error('Authentication failed: No token received');
    }
  } catch (error) {
    console.error('Authentication error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to authenticate with EvolutoSolution');
  }
};

export const checkLoanStatus = async (req, res) => {
  try {
    const { loan_application_id, ref_code } = req.body;

    if (!loan_application_id || !ref_code) {
      return res.status(400).json({ success: false, message: 'Missing loan_application_id or ref_code' });
    }

    // Step 1: Authenticate to get token
    const authToken = await authenticateEvoluto();

    // Step 2: Fetch loan status
    const statusConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.API_BASE_URL}/loan/status`,
      headers: {
        token: authToken,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        loan_application_id,
        ref_code,
      }),
    };

    const statusResponse = await axios.request(statusConfig);

    // Return the loan status data
    return res.status(200).json({
      success: true,
      data: statusResponse.data,
    });
  } catch (error) {
    console.error('Loan status error:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch loan status',
    });
  }
};