import React, { useState, useEffect } from "react";
import axios from "axios";

const CreditCheck = () => {
  // Pre-populate with test data for easier testing
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898", // Default value
    fname: "Mahesh",
    lname: "Waghmare",
    phone: "9370643086",
    pan_no: "ABSPW8730C",
    dob: "1982-06-03"
  });

  const [apiToken, setApiToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Authentication credentials
  const API_USERNAME = "47e3b88954003cab3e4f518c597651be73d2d966a41f8aec7f2697b72590d6c5";
  const API_PASSWORD = "BNRq8RMC366ClzU3X5ftP85yKInM/tDEb8gyzwv1/wmfVvpD7GTF5LrIRhSy1PEF97YXu3nsJzC3UhcrUl2TLAQMYrm0QGlQ0damxe2LEPT8sa5GIFGdMVRrC8vODtBSvt+pNjKnuiodXQHwuza1MtqK6E86mRx8K3AcAAO5FykGl4tfze9yeK3fGmgFZJ3z";

  // Base64 encoding is already done in the Authorization header

  // Fetch token on component mount
  // useEffect(() => {
  //   // Automatically fetch token when component loads
  //   fetchToken();
  // }, []);

  // Function to get API token
  const fetchToken = async () => {
    try {
      setError("");
      setIsAuthenticating(true);
      
      const response = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://uat-api.evolutosolution.com/v1/authentication',
        headers: { 
          'source': 'web', 
          'package': '10.0.2.215', 
          'outletid': 'OUI202590898', 
          'Authorization': 'Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o='
        }
      });

      console.log("Authentication response:", response.data);
      
      if (response.data && response.data.data && response.data.data.token) {
        setApiToken(response.data.data.token);
        console.log("Token acquired successfully");
      } else {
        setError("Failed to get API token: No token in response");
      }
    } catch (err) {
      console.error("Token fetch error:", err);
      setError(`Authentication failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiToken) {
      setError("API token is required. Please wait for authentication.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      console.log("Submitting with token:", apiToken);
      console.log("Form data:", formData);
      
      // Using the token in the header as required by the API
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://uat-api.evolutosolution.com/v1/loan/checkCreditScore',
        headers: { 
          'token': apiToken, // This is the correct header name based on your code
          'Content-Type': 'application/json'
        },
        data: formData
      };
      
      const response = await axios.request(config);

      console.log("Credit check response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Credit check error:", err);
      setError(err.response?.data?.message || "Failed to check credit score");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle direct test with fixed data
  const handleDirectTest = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = JSON.stringify({
        "ref_code": "OUI202590898",
        "fname": "Mahesh",
        "lname": "Waghmare",
        "phone": "9370643086",
        "pan_no": "ABSPW8730C",
        "dob": "1982-06-03"
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://uat-api.evolutosolution.com/v1/loan/checkCreditScore',
        headers: { 
          'token': apiToken,
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);
      console.log("Direct test response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Direct test error:", err);
      setError(err.response?.data?.message || "Failed to perform direct test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Check Credit Score
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isAuthenticating && !error && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Authenticating...
        </div>
      )}

      {loading && !error && !isAuthenticating && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Processing request...
        </div>
      )}

      {!isAuthenticating && apiToken && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Ready to check credit score
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={fetchToken}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isAuthenticating}
        >
          Get Fresh Token
        </button>
        
        <button
          onClick={handleDirectTest}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!apiToken || loading || isAuthenticating}
        >
          Run Direct Test
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ref_code"
          >
            Reference Code
          </label>
          <input
            id="ref_code"
            name="ref_code"
            type="text"
            value={formData.ref_code}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Default reference code used
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fname"
          >
            First Name
          </label>
          <input
            id="fname"
            name="fname"
            type="text"
            value={formData.fname}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lname"
          >
            Last Name
          </label>
          <input
            id="lname"
            name="lname"
            type="text"
            value={formData.lname}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pan_no"
          >
            PAN Number
          </label>
          <input
            id="pan_no"
            name="pan_no"
            type="text"
            value={formData.pan_no}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dob"
          >
            Date of Birth (YYYY-MM-DD)
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              !apiToken || loading || isAuthenticating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={!apiToken || loading || isAuthenticating}
          >
            {isAuthenticating ? "Authenticating..." : loading ? "Processing..." : "Check Credit Score"}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Credit Score Result</h3>

          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Success:</span>
              <span
                className={result.success ? "text-green-600" : "text-red-600"}
              >
                {result.success ? "Yes" : "No"}
              </span>
            </div>

            {result.message && (
              <div className="flex justify-between">
                <span className="font-medium">Message:</span>
                <span>{result.message}</span>
              </div>
            )}

            {result.statusCode && (
              <div className="flex justify-between">
                <span className="font-medium">Status Code:</span>
                <span>{result.statusCode}</span>
              </div>
            )}

            {result.data && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Credit Score:</h4>
                <div className="bg-green-100 p-4 rounded text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {result.data.score}
                  </div>
                  <div className="mt-2 text-green-800">
                    {result.data.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Display current form and token data for debugging */}
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
        <div className="mb-2">
          <strong>API Token:</strong> 
          <div className="text-xs overflow-auto bg-gray-200 p-2 rounded">
            {apiToken ? `${apiToken.substring(0, 20)}...` : "No token"}
          </div>
        </div>
        <div>
          <strong>Current Form Data:</strong>
          <pre className="text-xs overflow-auto bg-gray-200 p-2 rounded">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CreditCheck;