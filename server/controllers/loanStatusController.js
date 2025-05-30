import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getLoanStatus = async (req, res) => {
  const { loan_application_id, ref_code } = req.body;

  // Validate required fields
  if (!loan_application_id) {
    return res.status(200).json({ 
      success: false, 
      message: 'Loan Application ID is required',
      error_type: 'MISSING_LOAN_ID'
    });
  }

  if (!ref_code) {
    return res.status(200).json({ 
      success: false, 
      message: 'Reference code is required',
      error_type: 'MISSING_REF_CODE'
    });
  }

  try {
    console.log('Fetching loan status for:', { loan_application_id, ref_code });
    
    // Enhanced environment check
    console.log('Environment check:', {
      hasApiKey: !!process.env.API_KEY,
      hasApiSecret: !!process.env.API_SECRET,
      hasRefCode: !!process.env.REF_CODE,
      hasAuthUrl: !!process.env.EVOLUTO_AUTH_URL,
      hasStatusUrl: !!process.env.API_LOAN_STATUS_URL,
      hasBasicAuth: !!process.env.EVOLUTO_AUTH_BASIC,
      statusUrl: process.env.API_LOAN_STATUS_URL,
      authUrl: process.env.EVOLUTO_AUTH_URL
    });

    // Validate critical URLs before proceeding
    if (!process.env.API_LOAN_STATUS_URL) {
      console.error('API_LOAN_STATUS_URL is not set in environment variables');
      return res.status(200).json({
        success: false,
        message: 'API_LOAN_STATUS_URL environment variable is not configured',
        error_type: 'MISSING_ENV_VAR'
      });
    }

    if (!process.env.EVOLUTO_AUTH_URL) {
      console.error('EVOLUTO_AUTH_URL is not set in environment variables');
      return res.status(200).json({
        success: false,
        message: 'EVOLUTO_AUTH_URL environment variable is not configured',
        error_type: 'MISSING_ENV_VAR'
      });
    }

    // Step 1: Generate Token using Basic Authentication Header
    console.log('Attempting authentication with Basic Auth header...');
    console.log('Auth URL:', process.env.EVOLUTO_AUTH_URL);
    
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
      return res.status(200).json({ 
        success: false, 
        message: 'Failed to get authentication token',
        error_type: 'AUTH_TOKEN_MISSING',
        debug: authResponse.data
      });
    }

    console.log('Token received successfully');

    // Step 2: Get Loan Status using GET method with body data (as per working example)
    console.log('Fetching loan status with token using GET method with body...');
    console.log('Status URL:', process.env.API_LOAN_STATUS_URL);
    
    // Validate URL format
    try {
      new URL(process.env.API_LOAN_STATUS_URL);
      console.log('Status URL format is valid');
    } catch (urlError) {
      console.error('Invalid status URL format:', process.env.API_LOAN_STATUS_URL);
      return res.status(200).json({
        success: false,
        message: 'Invalid API_LOAN_STATUS_URL format',
        error_type: 'INVALID_URL_FORMAT',
        error: urlError.message
      });
    }

    // Prepare request data
    const requestData = {
      loan_application_id: loan_application_id,
      ref_code: ref_code,
    };

    console.log('Request data:', requestData);
    
    // Use GET method with data in body and token header (as per working example)
    const statusResponse = await axios({
      method: 'get',
      url: process.env.API_LOAN_STATUS_URL,
      headers: {
        'token': token, // Use 'token' header instead of 'Bearer' as per working example
        'Content-Type': 'application/json',
      },
      data: requestData, // Send data in body even for GET request
      timeout: 30000,
      maxBodyLength: Infinity
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
    console.error('Error code:', error.code);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Request config URL:', error.config?.url);
    console.error('Request config method:', error.config?.method);

    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      return res.status(200).json({
        success: false,
        message: 'Request timeout - API server took too long to respond',
        error: 'TIMEOUT',
        error_type: 'REQUEST_TIMEOUT'
      });
    }

    // Handle invalid URL error specifically
    if (error.message === 'Invalid URL' || error.code === 'ERR_INVALID_URL') {
      console.error('Invalid URL detected. Environment variables:');
      console.error('API_LOAN_STATUS_URL:', process.env.API_LOAN_STATUS_URL);
      console.error('EVOLUTO_AUTH_URL:', process.env.EVOLUTO_AUTH_URL);
      
      return res.status(200).json({
        success: false,
        message: 'Invalid URL configuration',
        error: 'INVALID_URL',
        error_type: 'INVALID_URL_CONFIG',
        details: {
          statusUrl: process.env.API_LOAN_STATUS_URL,
          authUrl: process.env.EVOLUTO_AUTH_URL
        }
      });
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      const statusCode = error.response.status;
      const errorData = error.response.data;
      
      return res.status(200).json({
        success: false,
        message: errorData?.message || `API request failed with status ${statusCode}`,
        error: errorData,
        status: statusCode,
        error_type: 'API_RESPONSE_ERROR',
        details: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString()
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(200).json({
        success: false,
        message: 'Unable to connect to loan status API - no response received',
        error: 'CONNECTION_ERROR',
        error_type: 'NO_RESPONSE'
      });
    } else {
      // Something happened in setting up the request
      return res.status(200).json({
        success: false,
        message: 'Internal Server Error - request setup failed',
        error_type: 'REQUEST_SETUP_ERROR',
        error: error.message,
      });
    }
  }
};