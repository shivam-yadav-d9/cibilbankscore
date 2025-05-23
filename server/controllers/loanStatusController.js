import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getLoanStatus = async (req, res) => {
  const { loan_application_id, ref_code } = req.body;

  if (!loan_application_id || !ref_code) {
    return res.status(400).json({ error: 'Missing loan_application_id or ref_code' });
  }

  try {
    // Use URLSearchParams for application/x-www-form-urlencoded
    const authParams = new URLSearchParams();
    authParams.append('api_key', process.env.API_KEY);
    authParams.append('api_secret', process.env.API_SECRET);
    authParams.append('ref_code', process.env.REF_CODE);

    const tokenRes = await axios.post(process.env.EVOLUTO_AUTH_URL, authParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = tokenRes.data.token;

    const statusRes = await axios.get(process.env.API_LOAN_STATUS_URL, {
      headers: {
        token,
        'Content-Type': 'application/json',
      },
      params: {
        loan_application_id,
        ref_code,
      },
    });

    res.status(200).json(statusRes.data);
  } catch (error) {
    console.error('Error fetching loan status:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch loan status' });
  }
};
