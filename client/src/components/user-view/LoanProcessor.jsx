import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LoanProcessor = () => {
  const location = useLocation();
  const loanTypeId = location.state?.loan_type_id;
  const navigate = useNavigate();

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
    loan_type_id: loanTypeId,
  });

  const [apiToken, setApiToken] = useState("");
  const [loanTypes, setLoanTypes] = useState([]);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const BASE_URL = "http://localhost:3001/api/loanProcessor";

  useEffect(() => {
    if (loanTypeId) {
      console.log(`Setting loan type ID from location state: ${loanTypeId}`);
      setFormData((prev) => ({
        ...prev,
        loan_type_id: loanTypeId,
      }));
    } else {
      console.warn("No loan type ID found in location state");
    }
  }, [loanTypeId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [navigate]);

  const fetchToken = async () => {
    try {
      setError("");
      setIsAuthenticating(true);

      const response = await axios.post(`${BASE_URL}/getToken`);

      if (response.data && response.data.success && response.data.token) {
        setApiToken(response.data.token);
        console.log("Token acquired successfully");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setFormData({
        ...formData,
        mobile: value,
        phone: value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = (bankId = null) => {
    const dataToStore = {
      ...formData,
      bank_id: bankId
    };
    localStorage.setItem("loanProcessorFormData", JSON.stringify(dataToStore));
    navigate("/UserBasicData", { 
      state: { 
        loan_type_id: loanTypeId,
        bank_id: bankId 
      } 
    });
  };

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

    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        setError("You must be at least 18 years old to apply for a loan.");
        return;
      }
    } else {
      setError("Please enter your date of birth.");
      return;
    }

    console.log(
      `Checking eligibility for loan type ID: ${formData.loan_type_id}`
    );

    setError("");
    setLoading(true);
    setEligibilityResult(null);

    const nameParts = formData.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const eligibilityData = {
      ...formData,
      fname: firstName,
      lname: lastName,
    };

    try {
      console.log("Sending eligibility request with data:", eligibilityData);

      const response = await axios.post(
        `${BASE_URL}/checkEligibility`,
        eligibilityData,
        {
          headers: {
            token: apiToken,
          },
        }
      );

      console.log(
        `Response received for loan type ID ${formData.loan_type_id}:`,
        response.data
      );

      if (
        response.data.data &&
        response.data.data.loan_type_id &&
        response.data.data.loan_type_id !== formData.loan_type_id
      ) {
        console.error(
          `Response loan type (${response.data.data.loan_type_id}) doesn't match requested type (${formData.loan_type_id})`
        );
        setError(
          "Received response for a different loan type than requested. Please try again."
        );
        setLoading(false);
        return;
      }

      if (response.data.success && response.data.data) {
        if (!Array.isArray(response.data.data)) {
          if (
            response.data.data.banks &&
            Array.isArray(response.data.data.banks)
          ) {
            response.data.data = response.data.data.banks;
          } else {
            response.data.data = [response.data.data];
          }
        }
        
        // Hide the form when eligibility results are shown
        setShowForm(false);
      }

      setEligibilityResult({
        ...response.data,
        requestedLoanTypeId: formData.loan_type_id,
      });
    } catch (err) {
      console.error("Eligibility check error:", err);
      setError(err.response?.data?.message || "Failed to check eligibility");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, loan_type_id: loanTypeId }));
  }, [loanTypeId]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-bank.png";
    e.target.alt = "Bank logo not available";
  };
  
  const handleResetForm = () => {
    setShowForm(true);
    setEligibilityResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Loan Eligibility Assessment
      </h2>

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

      {!isAuthenticating && apiToken && showForm && (
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

      {showForm && (
        <>
          <div className="flex justify-between mb-6">
            <button
              onClick={fetchToken}
              className="relative px-6 py-2 overflow-hidden rounded-lg bg-gray-100 text-gray-800 font-medium transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              disabled={isAuthenticating}
            >
              {apiToken ? "Refresh Token" : "Authenticate"}
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl px-8 pt-6 pb-8 mb-6 shadow-md border border-gray-100">
            {/* Form fields */}
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
        </>
      )}

      {/* Eligibility Result Card - Modern & Responsive Design */}
      {eligibilityResult && (
        <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Eligibility Result</h3>
              <button 
                onClick={handleResetForm}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              >
                New Check
              </button>
            </div>
            <div className="mt-2 opacity-80 text-sm">
              Loan Type ID: {eligibilityResult.requestedLoanTypeId || formData.loan_type_id}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between p-4 mb-6 rounded-lg bg-gray-50 border border-gray-100">
              <span className="font-medium text-gray-700">Status:</span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-bold ${
                  eligibilityResult.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {eligibilityResult.success ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </span>
            </div>

            {eligibilityResult.message && (
              <div className="p-4 mb-6 rounded-lg bg-blue-50 text-blue-700 text-sm">
                <span className="font-semibold">Message: </span>
                {eligibilityResult.message}
              </div>
            )}

            {eligibilityResult.data &&
              eligibilityResult.success &&
              Array.isArray(eligibilityResult.data) &&
              eligibilityResult.data.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-xl mb-4 text-gray-800">
                    Available Bank Options
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {eligibilityResult.data.map((bank, index) => (
                      <div
                        key={bank.id || index}
                        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                      >
                        <div className="h-24 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                          {bank.bank_logo ? (
                            <img
                              src={`/banks/${bank.bank.replace(/\s+/g, "").toLowerCase()}.png`}
                              alt={`${bank.bank} Logo`}
                              className="h-16 w-auto object-contain"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="text-2xl font-bold text-gray-400">
                              {bank.bank?.charAt(0) || "B"}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex-grow">
                          <h5 className="font-semibold text-lg text-gray-800 mb-2">
                            {bank.bank || "Bank Name Not Available"}
                          </h5>
                          
                          {bank.bank_description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {bank.bank_description}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            {bank.bank_interest_rate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Interest Rate:</span>
                                <span className="font-medium text-gray-800">{bank.bank_interest_rate}</span>
                              </div>
                            )}
                            
                            {bank.loan_amount && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Loan Amount:</span>
                                <span className="font-medium text-gray-800">{bank.loan_amount}</span>
                              </div>
                            )}
                            
                            {bank.tenure && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tenure:</span>
                                <span className="font-medium text-gray-800">{bank.tenure}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col space-y-2">
                          {bank.utm_url && (
                            <a
                              href={bank.utm_url}
                              className="inline-block bg-white border border-indigo-500 text-indigo-600 font-medium py-2 px-4 rounded-lg text-center hover:bg-indigo-50 transition-colors duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          )}
                          <button
                            onClick={() => handleNext(bank.id)}
                            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-all duration-200 shadow-sm hover:shadow"
                          >
                            Continue Application
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {eligibilityResult.data &&
              eligibilityResult.success &&
              (!Array.isArray(eligibilityResult.data) ||
                eligibilityResult.data.length === 0) && (
                <div className="mt-4 p-6 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                  <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-yellow-700 font-medium">
                    No bank details are available at the moment.
                  </p>
                  <p className="text-yellow-600 text-sm mt-2">
                    Please try again later or adjust your loan parameters.
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanProcessor;