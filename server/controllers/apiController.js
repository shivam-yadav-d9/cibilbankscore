import axios from "axios";

// const API_BASE_URL = "https://uat-api.evolutosolution.com/v1";
// const API_KEY =
//   "47e3b88954003cab3e4f518c597651be73d2d966a41f8aec7f2697b72590d6c5";
// const API_SECRET =
//   "BNRq8RMC366ClzU3X5ftP85yKInM/tDEb8gyzwv1/wmfVvpD7GTF5LrIRhSy1PEF97YXu3nsJzC3UhcrUl2TLAQMYrm0QGlQ0damxe2LEPT8sa5GIFGdMVRrC8vODtBSvt+pNjKnuiodXQHwuza1MtqK6E86mRx8K3AcAAO5FykGl4tfze9yeK3fGmgFZJ3z";



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
