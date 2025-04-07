import React, { useState, useEffect } from "react";
import axios from "axios";

const LoanProcessor = () => {
  // Pre-populate with test data for easier testing
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898",
    fname: "Mahesh",
    lname: "Waghmare",
    name: "Mahesh Waghmare",
    email: "maheshwagh23@gmail.com",
    mobile: "9370643086",
    phone: "9370643086",
    income_source: "1",
    income: "150000",
    pincode: "440034",
    dob: "1982-06-03",
    pan_no: "ABSPW8730C",
    aadhaar_no: "860682688230",
    cibil_score: "750",
    loan_amount: "100000",
    loan_type_id: ""
  });

  const [apiToken, setApiToken] = useState("");
  const [loanTypes, setLoanTypes] = useState([]);
  const [creditResult, setCreditResult] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState("creditCheck");

  // Authentication credentials - already Base64 encoded in the Authorization header
  const BASE_URL = "https://uat-api.evolutosolution.com/v1";

  // Function to get API token
  const fetchToken = async () => {
    try {
      setError("");
      setIsAuthenticating(true);
      
      const response = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/authentication`,
        headers: { 
          'source': 'web', 
          'package': '10.0.2.215', 
          'outletid': 'OUI202590898', 
          'Authorization': 'Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o='
        }
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
      setError(`Authentication failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Function to fetch loan types
  const fetchLoanTypes = async (token) => {
    try {
      setLoading(true);
      const config = {
        method: 'get',
        url: `${BASE_URL}/loan/getLoanTypes`,
        headers: { 
          'token': token,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.request(config);
      
      if (response.data && response.data.data) {
        setLoanTypes(response.data.data);
        // Set default loan type if available
        if (response.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            loan_type_id: response.data.data[0].id
          }));
        }
      } else {
        console.warn("No loan types received");
      }
    } catch (err) {
      console.error("Loan types fetch error:", err);
      setError(`Failed to fetch loan types: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for name field to update both name and fname/lname
    if (name === "name") {
      const nameParts = value.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setFormData({
        ...formData,
        name: value,
        fname: firstName,
        lname: lastName
      });
    } 
    // Special handling for mobile/phone to keep them in sync
    else if (name === "mobile") {
      setFormData({
        ...formData,
        mobile: value,
        phone: value
      });
    }
    else if (name === "phone") {
      setFormData({
        ...formData,
        phone: value,
        mobile: value
      });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Check credit score
  const checkCreditScore = async (e) => {
    if (e) e.preventDefault();

    if (!apiToken) {
      setError("API token is required. Please authenticate first.");
      return;
    }

    setError("");
    setLoading(true);
    setCreditResult(null);

    try {
      const creditData = {
        ref_code: formData.ref_code,
        fname: formData.fname,
        lname: formData.lname,
        phone: formData.phone,
        pan_no: formData.pan_no,
        dob: formData.dob
      };
      
      const config = {
        method: 'post',
        url: `${BASE_URL}/loan/checkCreditScore`,
        headers: { 
          'token': apiToken,
          'Content-Type': 'application/json'
        },
        data: creditData
      };
      
      const response = await axios.request(config);
      setCreditResult(response.data);
      
      // Update CIBIL score in the form data if available
      if (response.data.data && response.data.data.score) {
        setFormData(prev => ({
          ...prev,
          cibil_score: response.data.data.score
        }));
      }
    } catch (err) {
      console.error("Credit check error:", err);
      setError(err.response?.data?.message || "Failed to check credit score");
    } finally {
      setLoading(false);
    }
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

    try {
      const config = {
        method: 'post',
        url: `${BASE_URL}/loan/checkEligibility`,
        headers: { 
          'token': apiToken,
          'Content-Type': 'application/json'
        },
        data: formData
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Loan Processing System
      </h2>

      {/* Status messages */}
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
          Authentication successful
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between mb-4">
        <button
          onClick={fetchToken}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isAuthenticating}
        >
          {apiToken ? "Refresh Token" : "Authenticate"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'creditCheck' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('creditCheck')}
        >
          Credit Check
        </button>
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'eligibility' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('eligibility')}
        >
          Eligibility Check
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'allInfo' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('allInfo')}
        >
          Complete Form
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Common fields to both forms */}
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
        </div>

        {/* Display different form fields based on the active tab */}
        {(activeTab === 'creditCheck' || activeTab === 'allInfo') && (
          <>
            {/* Credit Check Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fname">
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lname">
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
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pan_no">
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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                Date of Birth
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

            {activeTab === 'creditCheck' && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={checkCreditScore}
                  className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                    !apiToken || loading || isAuthenticating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={!apiToken || loading || isAuthenticating}
                >
                  Check Credit Score
                </button>
              </div>
            )}
          </>
        )}

        {(activeTab === 'eligibility' || activeTab === 'allInfo') && (
          <>
            {/* Eligibility Check Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income_source">
                  Income Source
                </label>
                <select
                  id="income_source"
                  name="income_source"
                  value={formData.income_source}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="1">Salaried</option>
                  <option value="2">Self-employed</option>
                  <option value="3">Business</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income">
                  Monthly Income
                </label>
                <input
                  id="income"
                  name="income"
                  type="number"
                  value={formData.income}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadhaar_no">
                  Aadhaar Number
                </label>
                <input
                  id="aadhaar_no"
                  name="aadhaar_no"
                  type="text"
                  value={formData.aadhaar_no}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cibil_score">
                  CIBIL Score
                </label>
                <input
                  id="cibil_score"
                  name="cibil_score"
                  type="text"
                  value={formData.cibil_score}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loan_amount">
                  Loan Amount
                </label>
                <input
                  id="loan_amount"
                  name="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loan_type_id">
                Loan Type
              </label>
              <select
                id="loan_type_id"
                name="loan_type_id"
                value={formData.loan_type_id}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Loan Type</option>
                {loanTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === 'eligibility' && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={checkEligibility}
                  className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                    !apiToken || loading || isAuthenticating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={!apiToken || loading || isAuthenticating}
                >
                  Check Eligibility
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'allInfo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={checkCreditScore}
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !apiToken || loading || isAuthenticating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={!apiToken || loading || isAuthenticating}
            >
              Check Credit Score
            </button>
            
            <button
              onClick={checkEligibility}
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !apiToken || loading || isAuthenticating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              disabled={!apiToken || loading || isAuthenticating}
            >
              Check Eligibility
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Score Result */}
        {creditResult && (
          <div className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
            <h3 className="text-xl font-bold mb-2">Credit Score Result</h3>
            
            <div className="border-t border-b py-3 mb-3">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Success:</span>
                <span className={creditResult.success ? "text-green-600" : "text-red-600"}>
                  {creditResult.success ? "Yes" : "No"}
                </span>
              </div>

              {creditResult.message && (
                <div className="flex justify-between">
                  <span className="font-medium">Message:</span>
                  <span>{creditResult.message}</span>
                </div>
              )}

              {creditResult.data && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Credit Score:</h4>
                  <div className="bg-green-100 p-3 rounded text-center">
                    <div className="text-3xl font-bold text-green-700">
                      {creditResult.data.score}
                    </div>
                    <div className="mt-2 text-green-800">
                      {creditResult.data.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Result */}
        {eligibilityResult && (
          <div className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
            <h3 className="text-xl font-bold mb-2">Eligibility Result</h3>
            
            <div className="border-t border-b py-3 mb-3">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Status:</span>
                <span className={eligibilityResult.success ? "text-green-600" : "text-red-600"}>
                  {eligibilityResult.success ? "Eligible" : "Not Eligible"}
                </span>
              </div>

              {eligibilityResult.message && (
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Message:</span>
                  <span>{eligibilityResult.message}</span>
                </div>
              )}

              {eligibilityResult.data && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Details:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(eligibilityResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Debug Section */}
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Debug Information</h3>
          <button 
            className="text-xs bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
            onClick={() => console.log({formData, apiToken, creditResult, eligibilityResult})}
          >
            Log to Console
          </button>
        </div>
        
        <div className="mb-2">
          <strong>API Token:</strong> 
          <div className="text-xs overflow-auto bg-gray-200 p-2 rounded">
            {apiToken ? `${apiToken.substring(0, 20)}...` : "No token"}
          </div>
        </div>
        
        <div className="mb-2">
          <strong>Available Loan Types:</strong>
          <div className="text-xs overflow-auto bg-gray-200 p-2 rounded h-20">
            {loanTypes.length > 0 ? (
              <pre>{JSON.stringify(loanTypes.map(l => ({id: l.id, name: l.name})), null, 2)}</pre>
            ) : (
              "No loan types loaded"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanProcessor;