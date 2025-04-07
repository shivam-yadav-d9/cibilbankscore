import axios from "axios";

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://uat-api.evolutosolution.com/v1/authentication',
  headers: { 
    'source': 'web', 
    'package': '10.0.2.215', 
    'outletid': 'OUI202590898', 
    'Authorization': 'Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o='
  }
};

console.log(config)

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});


export const getApiToken = async (req, res) => {
  try {
    console.log("Attempting to get token from external API");

    // Add debugging for the request
    console.log("Request details:", {
      url: `${API_BASE_URL}/authentication`,
      api_key: API_KEY.substring(0, 10) + "...", // Only log part of the username for security
    });

    const response = await axios.post(`${API_BASE_URL}/authentication`, {
      api_key: API_KEY,
      api_secret: API_SECRET,
    });

    console.log("API response status:", response.status);

    if (response.data && response.data.token) {
      console.log("Token received successfully");
      return res
        .status(200)
        .json({ success: true, token: response.data.token });
    } else {
      console.log("No token in response:", response.data);
      return res.status(400).json({
        success: false,
        message: "Failed to get API token: No token in response",
        response: response.data,
      });
    }
  } catch (error) {
    console.error("API Authentication error details:");
    console.error("- Message:", error.message);
    console.error("- Response status:", error.response?.status);
    console.error("- Response data:", error.response?.data);

    // Provide detailed error response
    return res.status(error.response?.status || 500).json({
      success: false,
      message: `Authentication failed: ${error.message}`,
      error: error.response?.data || {},
      statusCode: error.response?.status || 500,
    });
  }
};

export const checkCreditScore = async (req, res) => {
  try {
    const {
      ref_code = "OUI202590898",
      fname,
      lname,
      phone,
      pan_no,
      dob,
    } = req.body;
    const apiToken = req.headers["x-api-token"];

    if (!apiToken) {
      return res
        .status(401)
        .json({ success: false, message: "API token is required" });
    }

    console.log("Making credit score check with data:", {
      ref_code,
      fname,
      lname,
      phone: phone.substring(0, 3) + "xxxx", // Mask for privacy in logs
      pan_no: "xxxxx" + pan_no.substring(pan_no.length - 3), // Mask for privacy in logs
      dob,
    });

    const response = await axios.post(
      `${API_BASE_URL}/loan/checkCreditScore`,
      {
        ref_code,
        fname,
        lname,
        phone,
        pan_no,
        dob,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    console.log("Credit check response received:", response.status);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Credit check error details:");
    console.error("- Message:", error.message);
    console.error("- Response status:", error.response?.status);
    console.error("- Response data:", error.response?.data);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: `Credit check failed: ${error.message}`,
      error: error.response?.data || {},
      statusCode: error.response?.status || 500,
    });
  }
};

export const checkEligibility = async (req, res) => {
  try {
    const {
      ref_code = "OUI202590898",
      loan_type_id,
      name,
      email,
      mobile,
      income_source,
      income,
      pincode,
      dob,
      pan_no,
      aadhaar_no,
      cibil_score,
      loan_amount
    } = req.body;
    
    const apiToken = req.headers["x-api-token"];

    if (!apiToken) {
      return res
        .status(401)
        .json({ success: false, message: "API token is required" });
    }

    console.log("Making eligibility check with data:", {
      ref_code,
      loan_type_id,
      name,
      email: email.substring(0, 3) + "..." + email.split('@')[1], // Mask email in logs
      mobile: mobile.substring(0, 3) + "xxxx", // Mask for privacy in logs
      pan_no: "xxxxx" + pan_no.substring(pan_no.length - 3), // Mask for privacy in logs
      aadhaar_no: "xxxx" + aadhaar_no.substring(aadhaar_no.length - 4), // Mask for privacy in logs
      income,
      pincode,
      dob,
      cibil_score,
      loan_amount
    });

    const response = await axios.post(
      `${API_BASE_URL}/loan/checkEligibility`,
      {
        ref_code,
        loan_type_id,
        name,
        email,
        mobile,
        income_source,
        income,
        pincode,
        dob,
        pan_no,
        aadhaar_no,
        cibil_score,
        loan_amount
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    console.log("Eligibility check response received:", response.status);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Eligibility check error details:");
    console.error("- Message:", error.message);
    console.error("- Response status:", error.response?.status);
    console.error("- Response data:", error.response?.data);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: `Eligibility check failed: ${error.message}`,
      error: error.response?.data || {},
      statusCode: error.response?.status || 500,
    });
  }
};
