import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Adjust path as needed

const UserPreviousData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    ref_code: "OUI202590898",
    application_id: "",
    userId: "",
    userType: "",
    loan_data: [
      {
        loan_account_no: "",
        loan_year: "",
        loan_amount: "",
        emi_amount: "",
        product: "",
        bank_name: ""
      }
    ]
  });

  useEffect(() => {
    let applicationId = "";
    let userId = "";
    let userType = "";

    if (location.state?.applicationId) {
      applicationId = location.state.applicationId;
    } else {
      applicationId = localStorage.getItem("applicationId") || "";
    }

    if (location.state?.userId) {
      userId = location.state.userId;
    } else {
      userId = localStorage.getItem("userId") || "";
    }

    if (location.state?.userType) {
      userType = location.state.userType;
    } else {
      userType = localStorage.getItem("userType") || "";
    }

    const savedFormData = localStorage.getItem(`previousLoans_${applicationId}`);
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData({
        ...parsedData,
        application_id: applicationId,
        userId,
        userType,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        application_id: applicationId,
        userId,
        userType,
      }));
    }
  }, [location]);

  const saveToLocalStorage = (data) => {
    if (data.application_id) {
      localStorage.setItem(
        `previousLoans_${data.application_id}`,
        JSON.stringify(data)
      );
    }
  };

  const handleChange = (index, field, value) => {
    const updatedLoanData = [...formData.loan_data];
    updatedLoanData[index][field] = value;
    const updatedFormData = { ...formData, loan_data: updatedLoanData };
    setFormData(updatedFormData);
    setError("");
    saveToLocalStorage(updatedFormData);
  };

  const addLoan = () => {
    const updatedFormData = {
      ...formData,
      loan_data: [
        ...formData.loan_data,
        {
          loan_account_no: "",
          loan_year: "",
          loan_amount: "",
          emi_amount: "",
          product: "",
          bank_name: ""
        }
      ]
    };
    setFormData(updatedFormData);
    saveToLocalStorage(updatedFormData);
  };

  const removeLoan = (index) => {
    if (formData.loan_data.length > 1) {
      const updatedLoanData = formData.loan_data.filter((_, idx) => idx !== index);
      const updatedFormData = { ...formData, loan_data: updatedLoanData };
      setFormData(updatedFormData);
      saveToLocalStorage(updatedFormData);
    }
  };

  const validateForm = () => {
    // Add your validation logic here if needed
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    saveToLocalStorage(formData);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user-previous-loans/save`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/UserDocuments", {
          state: {
            applicationId: formData.application_id,
            userId: formData.userId,
            userType: formData.userType,
          }
        });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Error submitting previous loan data. Please try again later."
      );
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // Theme-based classes
  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

  const cardClass = isDarkMode
    ? "max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
    : "max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

  const innerClass = isDarkMode ? "p-8 md:p-10" : "p-8 md:p-10";

  const sectionTitleClass = isDarkMode
    ? "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
    : "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600";

  const labelClass = isDarkMode
    ? "absolute -top-2.5 left-4 bg-slate-900 px-2 py-0.5 text-xs font-medium text-indigo-300 rounded-md shadow-sm z-10"
    : "absolute -top-2.5 left-4 bg-white px-2 py-0.5 text-xs font-medium text-indigo-600 rounded-md shadow-sm z-10";

  const inputClass = isDarkMode
    ? "w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
    : "w-full px-6 py-4 bg-white text-gray-800 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 shadow-sm";

  const loanBoxClass = isDarkMode
    ? "space-y-6 p-6 border border-indigo-700 rounded-2xl bg-slate-800/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
    : "space-y-6 p-6 border border-indigo-100 rounded-2xl bg-indigo-50/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md";

  const buttonClass = isDarkMode
    ? "w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:from-indigo-500 hover:to-purple-500 transform hover:-translate-y-0.5"
    : "w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-200 transform hover:-translate-y-0.5";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <div className={innerClass}>
          {error && (
            <div className={isDarkMode
              ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-fade-in transition-all duration-300"
              : "bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-fade-in transition-all duration-300"}>
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
              ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center animate-fade-in transition-all duration-300"
              : "bg-emerald-50/80 backdrop-blur-sm border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center animate-fade-in transition-all duration-300"}>
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
              <p>Previous loans submitted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h2 className={sectionTitleClass}>
                Previous Loan Details
              </h2>
              <p className={isDarkMode ? "text-slate-300 mt-2" : "text-gray-500 mt-2"}>
                Enter your previous loan information below
              </p>
            </div>

            {/* Application ID */}
            <div className="relative backdrop-blur-sm mb-8">
              <label className={labelClass}>
                Application ID
              </label>
              <input
                type="text"
                value={formData.application_id}
                onChange={(e) => setFormData({...formData, application_id: e.target.value})}
                placeholder="Enter application ID"
                className={inputClass}
                readOnly
              />
            </div>

            {formData.loan_data.map((loan, idx) => (
              <div key={idx} className={loanBoxClass}>
                <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
                  <div className="flex items-center">
                    <div className={isDarkMode
                      ? "w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm mr-3"
                      : "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm mr-3"}>
                      {idx + 1}
                    </div>
                    <h3 className={isDarkMode ? "text-lg font-semibold text-indigo-200" : "text-lg font-semibold text-indigo-800"}>
                      Loan Details
                    </h3>
                  </div>
                  {formData.loan_data.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLoan(idx)}
                      className="text-indigo-500 hover:text-red-500 text-sm font-medium transition-colors duration-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className={labelClass}>
                      Loan Account No<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={loan.loan_account_no}
                      onChange={e => handleChange(idx, "loan_account_no", e.target.value)}
                      placeholder="Enter loan account number"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <label className={labelClass}>
                      Loan Year<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={loan.loan_year}
                      onChange={e => handleChange(idx, "loan_year", e.target.value)}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className={labelClass}>
                      Loan Amount<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={loan.loan_amount}
                        onChange={e => handleChange(idx, "loan_amount", e.target.value)}
                        placeholder="Enter loan amount"
                        min="0"
                        step="0.01"
                        className={inputClass + " pl-12"}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className={labelClass}>
                      EMI Amount<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={loan.emi_amount}
                        onChange={e => handleChange(idx, "emi_amount", e.target.value)}
                        placeholder="Enter EMI amount"
                        min="0"
                        step="0.01"
                        className={inputClass + " pl-12"}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className={labelClass}>
                      Product<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={loan.product}
                      onChange={e => handleChange(idx, "product", e.target.value)}
                      placeholder="Enter product name"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <label className={labelClass}>
                      Bank Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={loan.bank_name}
                      onChange={e => handleChange(idx, "bank_name", e.target.value)}
                      placeholder="Enter bank name"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLoan}
              className="w-full py-3 px-6 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-400 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Add Another Loan
            </button>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`${buttonClass} ${loading ? "bg-gray-600 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Save & Continue</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col md:flex-row justify-between pt-4 text-sm">
              <Link
                to="/UserCoApplications"
                className="mb-2 md:mb-0 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Co-applicants
              </Link>
              <Link
                to="/LoanReportDetail"
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
                state={{ applicationId: formData.application_id }}
              >
                Skip to Loan Report
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPreviousData;