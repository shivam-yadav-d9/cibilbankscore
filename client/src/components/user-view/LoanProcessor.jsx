import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation

const LoanProcessor = () => {
  const location = useLocation(); // Get location object
  const loanTypeId = location.state?.loan_type_id; // Retrieve loan_type_id
  const navigate = useNavigate();

  // Pre-populate with test data for easier testing
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898",
    name: "",
    email: "",
    mobile: "",
    phone: "",
    income_source: "1",
    income: "",
    pincode: "",
    dob: "",
    pan_no: "",
    aadhaar_no: "",
    cibil_score: "",
    loan_amount: "",
    loan_type_id: loanTypeId, // Initialize with the passed value
  });

  const [apiToken, setApiToken] = useState("");
  const [loanTypes, setLoanTypes] = useState([]);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Authentication credentials - already Base64 encoded in the Authorization header
  const BASE_URL = "https://uat-api.evolutosolution.com/v1";

  useEffect(() => {
    if (!loanTypeId) {
      console.error("Loan type ID is missing. This should not happen.");
      setError(
        "Loan type ID is missing. Please go back and select a loan type."
      );
      return; // Stop further execution if loanTypeId is missing
    }
  }, [loanTypeId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        // You can add more fields here if they're available in user data
      }));
    }
  }, [navigate]);

  // Function to get API token
  const fetchToken = async () => {
    try {
      setError("");
      setIsAuthenticating(true);

      const response = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/authentication`,
        headers: {
          source: "web",
          package: "10.0.2.215",
          outletid: "OUI202590898",
          Authorization:
            "Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o=",
        },
      });

      if (response.data && response.data.data && response.data.data.token) {
        setApiToken(response.data.data.token);
        console.log("Token acquired successfully");
        // After getting token, fetch loan types
        fetchLoanTypes(response.data.data.token);
      } else {
        setError("Failed to get API token: No token in response");
      }
    } catch (err) {
      console.error("Token fetch error:", err);
      setError(
        `Authentication failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Function to fetch loan types
  const fetchLoanTypes = async (token) => {
    try {
      setLoading(true);
      const config = {
        method: "get",
        url: `${BASE_URL}/loan/getLoanTypes`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.data) {
        setLoanTypes(response.data.data);
      } else {
        console.warn("No loan types received");
      }
    } catch (err) {
      console.error("Loan types fetch error:", err);
      setError(
        `Failed to fetch loan types: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for mobile/phone to keep them in sync
    if (name === "mobile") {
      setFormData({
        ...formData,
        mobile: value,
        phone: value,
      });
      // } else if (name === "phone") {
      //   setFormData({
      //     ...formData,
      //     phone: value,
      //     mobile: value,
      //   });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    // Store the current form data in localStorage
    localStorage.setItem("loanProcessorFormData", JSON.stringify(formData));
    navigate("/UserBasicData", { state: { loan_type_id: loanTypeId } });
  };

  // Check eligibility
  const checkEligibility = async (e) => {
    if (e) e.preventDefault();

    if (!apiToken) {
      setError("API token is required. Please authenticate first.");
      return;
    }

    if (!formData.loan_type_id) {
      setError("Please select a loan type");
      return;
    }

    setError("");
    setLoading(true);
    setEligibilityResult(null);

    // Extract first and last name from full name for API compatibility
    const nameParts = formData.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create API request data with first and last name fields
    const eligibilityData = {
      ...formData,
      fname: firstName,
      lname: lastName,
    };

    try {
      const config = {
        method: "post",
        url: `${BASE_URL}/loan/checkEligibility`,
        headers: {
          token: apiToken,
          "Content-Type": "application/json",
        },
        data: eligibilityData,
      };

      const response = await axios.request(config);
      setEligibilityResult(response.data);
    } catch (err) {
      console.error("Eligibility check error:", err);
      setError(err.response?.data?.message || "Failed to check eligibility");
    } finally {
      setLoading(false);
    }
  };

  // Load token on component mount
  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    // Update form data when loanTypeId changes (e.g., when navigating from UserLoanpage)
    setFormData((prev) => ({ ...prev, loan_type_id: loanTypeId }));
  }, [loanTypeId]);

  return (
    /* Tailwind CSS styling for subtly futuristic loan processor with white background */

    // Main container with soft shadows and subtle gradient border
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Loan Eligibility Assessment
      </h2>

      {/* Status messages with clean design */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-3 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {isAuthenticating && !error && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
            Authenticating...
          </div>
        </div>
      )}

      {loading && !error && !isAuthenticating && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <div className="animate-pulse mr-3 h-5 w-5 bg-blue-600 rounded-full"></div>
            Processing request...
          </div>
        </div>
      )}

      {!isAuthenticating && apiToken && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-3 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Authentication successful
          </div>
        </div>
      )}

      {/* Action buttons with subtle effects */}
      <div className="flex justify-between mb-6">
        <button
          onClick={fetchToken}
          className="relative px-6 py-2 overflow-hidden rounded-lg bg-gray-100 text-gray-800 font-medium transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          disabled={isAuthenticating}
        >
          {apiToken ? "Refresh Token" : "Authenticate"}
        </button>
      </div>

      {/* Form with subtle futuristic design */}
      <div className="bg-gray-50 rounded-xl px-8 pt-6 pb-8 mb-6 shadow-md border border-gray-100">
        {/* Full Name Field with subtle glow effect on focus */}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            readOnly
            className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Two-column grid with responsive design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="mobile"
            >
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stylized select dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="income_source"
            >
              Income Source
            </label>
            <div className="relative">
              <select
                id="income_source"
                name="income_source"
                value={formData.income_source}
                onChange={handleChange}
                required
                className="appearance-none w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              >
                <option value="1">Salaried</option>
                <option value="2">Self-employed</option>
                <option value="3">Business</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="income"
            >
              Monthly Income
            </label>
            <input
              id="income"
              name="income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date of Birth and PAN Number fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
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
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pincode and Aadhaar Number fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="pincode"
            >
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="aadhaar_no"
            >
              Aadhaar Number
            </label>
            <input
              id="aadhaar_no"
              name="aadhaar_no"
              type="text"
              value={formData.aadhaar_no}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* CIBIL Score and Loan Amount fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="cibil_score"
            >
              CIBIL Score
            </label>
            <input
              id="cibil_score"
              name="cibil_score"
              type="text"
              value={formData.cibil_score}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="loan_amount"
            >
              Loan Amount
            </label>
            <input
              id="loan_amount"
              name="loan_amount"
              type="number"
              value={formData.loan_amount}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit button with subtle gradient */}
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={checkEligibility}
            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 focus:outline-none ${
              !apiToken || loading || isAuthenticating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            }`}
            disabled={!apiToken || loading || isAuthenticating}
          >
            Check Eligibility
          </button>
        </div>
      </div>

      {/* Eligibility Result Card */}
      {eligibilityResult && (
        <div className="bg-white rounded-xl px-6 pt-5 pb-6 mb-6 shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">
            Eligibility Result
          </h3>

          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-gray-700">Status:</span>
              <span
                className={
                  eligibilityResult.success
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {eligibilityResult.success ? "Eligible" : "Not Eligible"}
              </span>
            </div>

            {eligibilityResult.message && (
              <div className="flex justify-between mb-3">
                <span className="font-medium text-gray-700">Message:</span>
                <span className="text-gray-800">
                  {eligibilityResult.message}
                </span>
              </div>
            )}

            {eligibilityResult.data && (
              <div className="mt-4">
                <h4 className="font-medium mb-3 text-gray-700">Details:</h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto text-gray-800 border border-gray-200">
                  {JSON.stringify(eligibilityResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue Application Button with subtle animation */}
      <Link to="/UserBasicData">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          Continue Application
        </button>
      </Link>
    </div>
  );
};

export default LoanProcessor;
