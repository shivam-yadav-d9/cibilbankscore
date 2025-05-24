import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getLoanStatus = async (req, res) => {
  const { loan_application_id, ref_code } = req.body;

  // Validate required fields
  if (!loan_application_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Loan Application ID is required' 
    });
  }

  if (!ref_code) {
    return res.status(400).json({ 
      success: false, 
      message: 'Reference code is required' 
    });
  }

  try {
    console.log('Fetching loan status for:', { loan_application_id, ref_code });
    console.log('Environment check:', {
      hasApiKey: !!process.env.API_KEY,
      hasApiSecret: !!process.env.API_SECRET,
      hasRefCode: !!process.env.REF_CODE,
      hasAuthUrl: !!process.env.EVOLUTO_AUTH_URL,
      hasStatusUrl: !!process.env.API_LOAN_STATUS_URL,
      hasBasicAuth: !!process.env.EVOLUTO_AUTH_BASIC
    });

    // Step 1: Generate Token using Basic Authentication Header
    console.log('Attempting authentication with Basic Auth header...');
    
    const authResponse = await axios.post(process.env.EVOLUTO_AUTH_URL, {
      ref_code: process.env.REF_CODE,
    }, {
      headers: {
        'Authorization': `Basic ${process.env.EVOLUTO_AUTH_BASIC}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', authResponse.data);
    
    const token = authResponse.data?.data?.token;
    if (!token) {
      console.error('No token in auth response:', authResponse.data);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get authentication token',
        debug: authResponse.data
      });
    }

    console.log('Token received successfully');

    // Step 2: Get Loan Status using GET method with query parameters
    console.log('Fetching loan status with token using GET method...');
    
    const statusResponse = await axios.get(process.env.API_LOAN_STATUS_URL, {
      params: {
        loan_application_id: loan_application_id,
        ref_code: ref_code,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    console.log('Status response received:', statusResponse.status);
    console.log('Status response data:', statusResponse.data);

    return res.status(200).json({
      success: true,
      message: 'Loan status fetched successfully',
      data: statusResponse.data,
    });

  } catch (error) {
    console.error('Error fetching loan status:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Request config:', error.config);

    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Request timeout - API server took too long to respond',
        error: 'TIMEOUT'
      });
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      const statusCode = error.response.status;
      const errorData = error.response.data;
      
      return res.status(statusCode).json({
        success: false,
        message: errorData?.message || 'API request failed',
        error: errorData,
        status: statusCode,
        details: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString()
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to loan status API - no response received',
        error: 'CONNECTION_ERROR'
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error - request setup failed',
        error: error.message,
      });
    }
  }
};