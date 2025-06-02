import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Adjust path as needed

const LoanProcessor = () => {
  const location = useLocation();
  const loanTypeId = location.state?.loan_type_id;
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Detect userType from localStorage
  const [userType, setUserType] = useState(null);
  const [jwtToken, setJwtToken] = useState("");

  const [formData, setFormData] = useState({
    ref_code: "OUI2025107118",
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
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/loanProcessor`;

  useEffect(() => {
    if (loanTypeId) {
      setFormData((prev) => ({
        ...prev,
        loan_type_id: loanTypeId,
      }));
    }
  }, [loanTypeId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }
    setJwtToken(token);

    if (userData) {
      const user = JSON.parse(userData);
      setUserType(user.userType || null);

      // Only prefill for customers
      if (user.userType !== "business") {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
        }));
      }
    }
  }, [navigate]);

  const fetchCibilScore = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/credit/get-from-db?number=${formData.phone}`
      );

      console.log("CIBIL API Response:", res.data);

      if (res.data.success && res.data.data) {
        const score = res.data.data.credit_score || "";

        alert(`CIBIL Score fetched: ${score}`);

        setFormData((prev) => ({
          ...prev,
          cibil_score: score,
        }));

        setError("");
      } else {
        // Unexpected case: success = false but not a thrown error
        alert("Unable to fetch CIBIL score. Please try again.");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Error fetching CIBIL score";

      console.error("Fetch CIBIL Error:", message);

      // ✅ Expired score
      if (status === 403) {
        alert("Your CIBIL score has expired. Please re-check.");
        setFormData((prev) => ({
          ...prev,
          cibil_score: "", // Clear old score
        }));
      }

      // ✅ Not found
      else if (status === 404) {
        alert("No CIBIL score found. Please generate it.");
      }

      // ✅ Other server or network errors
      else {
        alert("Error fetching CIBIL score");
      }

      navigate("/credit-check");
    }
  };



  // Fetch API token with JWT if required
  const fetchToken = async () => {
    try {
      setError("");
      setIsAuthenticating(true);

      const config = {};
      if (jwtToken) {
        config.headers = { Authorization: `Bearer ${jwtToken}` };
      }

      const response = await axios.post(`${BASE_URL}/getToken`, {}, config);

      if (response.data && response.data.success && response.data.token) {
        setApiToken(response.data.token);
        setSuccess("Authentication successful");
      } else {
        setError("Failed to get API token: No token in response");
      }
    } catch (err) {
      setError(
        `Authentication failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    fetchToken();
    // eslint-disable-next-line
  }, [jwtToken]);

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
      const response = await axios.post(
        `${BASE_URL}/checkEligibility`,
        eligibilityData,
        {
          headers: {
            token: apiToken,
          },
        }
      );

      // Normalize data to always be an array of banks
      let banks = [];
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          banks = response.data.data;
        } else if (response.data.data.banks && Array.isArray(response.data.data.banks)) {
          banks = response.data.data.banks;
        } else {
          banks = [response.data.data];
        }
        setShowForm(false);
      }

      setEligibilityResult({
        ...response.data,
        data: banks,
        requestedLoanTypeId: formData.loan_type_id,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check eligibility");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-bank.png";
    e.target.alt = "Bank logo not available";
  };

  const handleResetForm = () => {
    setShowForm(true);
    setEligibilityResult(null);
  };

  // Theme-based classes
  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

  const cardClass = isDarkMode
    ? "max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
    : "max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

  const innerClass = isDarkMode
    ? "p-8 md:p-12"
    : "p-8 md:p-12";

  const sectionTitleClass = isDarkMode
    ? "text-4xl font-bold text-white mb-2"
    : "text-4xl font-bold text-gray-900 mb-2";

  const labelClass = isDarkMode
    ? "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-400"
    : "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-600";

  const inputClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

  const selectClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

  const buttonClass = isDarkMode
    ? "px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
    : "px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div className={isDarkMode
              ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-pulse"
              : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-pulse"}>
              <svg
                className="h-5 w-5 mr-3"
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
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className={isDarkMode
              ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"}>
              <svg
                className="h-5 w-5 mr-3"
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
              <p>{success}</p>
            </div>
          )}

          {isAuthenticating && (
            <div className={isDarkMode
              ? "bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/50 text-indigo-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl flex items-center"}>
              <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-indigo-400 rounded-full"></div>
              <p>Authenticating...</p>
            </div>
          )}

          {loading && (
            <div className={isDarkMode
              ? "bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/50 text-indigo-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl flex items-center"}>
              <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-indigo-400 rounded-full"></div>
              <p>Processing request...</p>
            </div>
          )}

          {showForm && (
            <form onSubmit={checkEligibility} className="space-y-8">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className={isDarkMode
                    ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                    : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"}></div>
                </div>
                <h2 className={sectionTitleClass}>
                  <span className={isDarkMode
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}>
                    Loan Eligibility Assessment
                  </span>
                </h2>
                <p className={isDarkMode ? "text-slate-300" : "text-gray-500"}>Check your loan eligibility with our partner banks</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6 md:col-span-2">
                  <div className="flex items-center">
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                    <h3 className={isDarkMode
                      ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                      : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Details
                    </h3>
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name and Email: Prefilled and readOnly for customers, empty and editable for agents */}
                    <div className="group relative">
                      <input
                        name="name"
                        placeholder=" "
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        readOnly={userType !== null && userType !== "business"}
                      />
                      <label className={labelClass}>
                        Full Name
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        name="email"
                        placeholder=" "
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        readOnly={userType !== null && userType !== "business"}
                      />
                      <label className={labelClass}>
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <input
                        name="mobile"
                        placeholder=" "
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        readOnly={userType !== null && userType !== "business"}
                      />
                      <label className={labelClass}>
                        Mobile Number
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={isDarkMode
                        ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium"
                        : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                        Date of Birth
                      </label>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-6 md:col-span-2">
                  <div className="flex items-center">
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                    <h3 className={isDarkMode
                      ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                      : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location Details
                    </h3>
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <input
                        name="pincode"
                        placeholder=" "
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={labelClass}>
                        Pincode
                      </label>
                    </div>
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="space-y-6 md:col-span-2">
                  <div className="flex items-center">
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                    <h3 className={isDarkMode
                      ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                      : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Financial Details
                    </h3>
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <select
                        name="income_source"
                        value={formData.income_source}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="1">Salaried</option>
                        <option value="2">Self-Employed</option>
                        <option value="3">Business</option>
                      </select>
                      <label className={isDarkMode
                        ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium"
                        : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                        Income Source
                      </label>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="group relative">
                      <input
                        name="income"
                        placeholder=" "
                        value={formData.income}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={labelClass}>
                        Monthly Income
                      </label>
                    </div>
                  </div>

                  {/* Loan Type selection removed as per your request */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <input
                        name="loan_amount"
                        placeholder=" "
                        type="number"
                        value={formData.loan_amount}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={labelClass}>
                        Loan Amount
                      </label>
                    </div>
                  </div>
                </div>

                {/* ID Information Section */}
                <div className="space-y-6 md:col-span-2">
                  <div className="flex items-center">
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                    <h3 className={isDarkMode
                      ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                      : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      ID Details
                    </h3>
                    <div className={isDarkMode
                      ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                      : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <input
                        name="pan_no"
                        placeholder=" "
                        value={formData.pan_no}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={labelClass}>
                        PAN Number
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        name="aadhaar_no"
                        placeholder=" "
                        value={formData.aadhaar_no}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                      <label className={labelClass}>
                        Aadhaar Number
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CIBIL Score Input */}
                    <div className="group relative">
                      <input
                        name="cibil_score"
                        placeholder=" "
                        value={formData.cibil_score}
                        onChange={handleChange}
                        className={inputClass}
                        //readOnly // ✅ Prevent manual input
                      />
                      <label className={labelClass}>CIBIL Score</label>

                      {/* ✅ Show message if score is missing or expired */}
                      {formData.cibil_score === "" && (
                        <p className="text-red-600 text-sm mt-1">
                          CIBIL score not available or expired. Please click "Get CIBIL Score".
                        </p>
                      )}
                    </div>

                    {/* Fetch Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={fetchCibilScore}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Get CIBIL Score
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isAuthenticating || loading}
                  className={buttonClass}
                >
                  <span className="flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Check Eligibility
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}

          {eligibilityResult && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Eligible Loan Options
                  </span>
                </h2>
                <p className="text-slate-300">
                  Select a bank to proceed with your application
                </p>
              </div>

              {eligibilityResult.success === false ? (
                <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-8 rounded-2xl mb-8">
                  <div className="flex flex-col items-center text-center">
                    <svg className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-red-100 mb-2">Not Eligible</h3>
                    <p className="text-red-200">{eligibilityResult.message || "We're sorry, but you're not eligible for this loan at this time."}</p>

                    <button
                      onClick={handleResetForm}
                      className="mt-6 px-6 py-3 bg-red-700 hover:bg-red-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
                    >
                      <span className="flex items-center">
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        Try Again
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {Array.isArray(eligibilityResult.data) && eligibilityResult.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {eligibilityResult.data.map((bank, index) => (
                        <div
                          key={bank.id || bank.bank_id || index}
                          className="bg-slate-800/50 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:translate-y-[-5px] cursor-pointer"
                          onClick={() => handleNext(bank.id || bank.bank_id)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="h-16 w-16 flex items-center justify-center bg-white rounded-xl overflow-hidden">
                              <img
                                src={`/banks/${(bank.bank || "defaultbank").replace(/\s+/g, "").toLowerCase()}.png`}
                                alt={`${bank.bank} Logo`}
                                className="h-12 w-auto object-contain"
                                onError={handleImageError}
                              />
                            </div>
                            <div className="bg-emerald-900/20 text-emerald-400 px-3 py-1 rounded-lg font-medium flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Eligible
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-1">
                            {bank.name || bank.bank || "Bank Offer"}
                          </h3>

                          <div className="mb-4 text-slate-300">
                            {bank.description || bank.bank_description ? (
                              <p className="text-sm">{bank.description || bank.bank_description}</p>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-900/50 p-3 rounded-xl">
                              <p className="text-xs text-slate-400 mb-1">Interest Rate</p>
                              <p className="text-lg font-bold text-white">{bank.interest_rate || bank.bank_interest_rate || "-"}%</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl">
                              <p className="text-xs text-slate-400 mb-1">Loan Amount</p>
                              <p className="text-lg font-bold text-white">₹{Number(bank.loan_amount || formData.loan_amount).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl">
                              <p className="text-xs text-slate-400 mb-1">Tenure</p>
                              <p className="text-lg font-bold text-white">{bank.tenure || "-"} Months</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl">
                              <p className="text-xs text-slate-400 mb-1">EMI</p>
                              <p className="text-lg font-bold text-white">₹{Number(bank.emi || 0).toLocaleString()}</p>
                            </div>
                          </div>

                          <button
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:outline-none transition-all duration-300 hover:scale-105"
                            onClick={() => handleNext(bank.id || bank.bank_id)}
                          >
                            <span className="flex items-center justify-center">
                              Select This Offer
                              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 backdrop-blur-sm border border-amber-500/50 text-amber-100 p-8 rounded-2xl text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-16 w-16 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-amber-100 mb-2">No Results Found</h3>
                        <p className="text-amber-200">No eligible loan options were found for your criteria.</p>

                        <button
                          onClick={handleResetForm}
                          className="mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
                        >
                          <span className="flex items-center">
                            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                            </svg>
                            Try Again
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-2 text-slate-300 hover:text-white font-medium transition-all duration-300 flex items-center mx-auto"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                      </svg>
                      Back to Eligibility Form
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              to="/"
              className={isDarkMode
                ? "text-indigo-400 hover:text-indigo-300 font-medium flex items-center transition-all duration-300"
                : "text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-all duration-300"}
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanProcessor;