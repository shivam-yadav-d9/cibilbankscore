import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getLoanStatus = async (req, res) => {
  const { loan_application_id, ref_code } = req.body;

  // Validate required fields
  if (!loan_application_id) {
    return res.status(400).json({
      success: false,
      message: 'Loan Application ID is required',
      error_code: 'MISSING_LOAN_ID',
    });
  }

  if (!ref_code) {
    return res.status(400).json({
      success: false,
      message: 'Reference code is required',
      error_code: 'MISSING_REF_CODE',
    });
  }

  try {
    console.log('Fetching loan status for:', { loan_application_id, ref_code });

    // Enhanced environment check
    const envCheck = {
      hasApiKey: !!process.env.API_KEY,
      hasApiSecret: !!process.env.API_SECRET,
      hasRefCode: !!process.env.REF_CODE,
      hasAuthUrl: !!process.env.EVOLUTO_AUTH_URL,
      hasStatusUrl: !!process.env.API_LOAN_STATUS_URL,
      hasBasicAuth: !!process.env.EVOLUTO_AUTH_BASIC,
      authUrl: process.env.EVOLUTO_AUTH_URL || 'MISSING',
      statusUrl: process.env.API_LOAN_STATUS_URL || 'MISSING',
      refCode: process.env.REF_CODE || 'MISSING',
    };
    console.log('Environment check:', envCheck);

    // Validate environment variables
    if (!process.env.EVOLUTO_AUTH_URL || !process.env.EVOLUTO_AUTH_URL.match(/^https?:\/\//)) {
      console.error('Invalid or missing EVOLUTO_AUTH_URL:', process.env.EVOLUTO_AUTH_URL);
      return res.status(500).json({
        success: false,
        message: 'Authentication URL is not properly configured',
        error_code: 'INVALID_AUTH_URL',
        debug: { authUrl: process.env.EVOLUTO_AUTH_URL },
      });
    }

    if (!process.env.API_LOAN_STATUS_URL || !process.env.API_LOAN_STATUS_URL.match(/^https?:\/\//)) {
      console.error('Invalid or missing API_LOAN_STATUS_URL:', process.env.API_LOAN_STATUS_URL);
      return res.status(500).json({
        success: false,
        message: 'Loan status URL is not properly configured',
        error_code: 'INVALID_STATUS_URL',
        debug: { statusUrl: process.env.API_LOAN_STATUS_URL },
      });
    }

    if (!process.env.REF_CODE) {
      console.error('Missing REF_CODE in environment');
      return res.status(500).json({
        success: false,
        message: 'Reference code is not configured in environment',
        error_code: 'MISSING_ENV_REF_CODE',
      });
    }

    if (!process.env.EVOLUTO_AUTH_BASIC) {
      console.error('Missing EVOLUTO_AUTH_BASIC in environment');
      return res.status(500).json({
        success: false,
        message: 'Basic authentication is not configured',
        error_code: 'MISSING_BASIC_AUTH',
      });
    }

    // Verify EVOLUTO_AUTH_BASIC is valid Base64
    try {
      Buffer.from(process.env.EVOLUTO_AUTH_BASIC, 'base64').toString('ascii');
    } catch (error) {
      console.error('Invalid EVOLUTO_AUTH_BASIC format:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Invalid Basic authentication configuration',
        error_code: 'INVALID_BASIC_AUTH',
        debug: { error: error.message },
      });
    }

    // Step 1: Generate Token using Basic Authentication Header
    console.log('Attempting authentication with Basic Auth header...');
    console.log('Auth URL:', process.env.EVOLUTO_AUTH_URL);

    const authResponse = await axios.post(
      process.env.EVOLUTO_AUTH_URL,
      { ref_code: process.env.REF_CODE },
      {
        headers: {
          Authorization: `Basic ${process.env.EVOLUTO_AUTH_BASIC}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', authResponse.data);

    const token = authResponse.data?.data?.token;
    if (!token) {
      console.error('No token in auth response:', authResponse.data);
      return res.status(401).json({
        success: false,
        message: 'Failed to get authentication token',
        error_code: 'AUTH_TOKEN_FAILED',
        debug: authResponse.data,
      });
    }

    console.log('Token received successfully:', token);

    // Step 2: Get Loan Status using GET method with query parameters
    console.log('Fetching loan status with token...');
    console.log('Status URL:', process.env.API_LOAN_STATUS_URL);

    const statusResponse = await axios.get(process.env.API_LOAN_STATUS_URL, {
      params: {
        loan_application_id,
        ref_code,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    console.log('Status response received:', statusResponse.status);
    console.log('Status response data:', statusResponse.data);

    return res.status(200).json({
      success: true,
      message: 'Loan status fetched successfully',
      data: statusResponse.data,
    });
  } catch (error) {
    console.error('Error fetching loan status:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - API server took too long to respond',
        error_code: 'TIMEOUT',
        details: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (error.message.includes('Invalid URL') || error.code === 'ERR_INVALID_URL') {
      return res.status(500).json({
        success: false,
        message: 'Invalid URL configuration - please check environment variables',
        error_code: 'INVALID_URL',
        details: {
          error_message: error.message,
          config_url: error.config?.url || 'URL not available',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.message || 'API request failed',
        error_code: 'API_ERROR',
        api_status: error.response.status,
        error_details: error.response.data,
        details: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (error.request) {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to loan status API - no response received',
        error_code: 'CONNECTION_ERROR',
        details: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process loan status request',
      error_code: 'REQUEST_SETUP_ERROR',
      error_details: error.message,
      details: {
        timestamp: new Date().toISOString(),
      },
    });
  }
};