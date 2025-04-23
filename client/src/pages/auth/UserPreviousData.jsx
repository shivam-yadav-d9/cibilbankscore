import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserPreviousData = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        ref_code: "OUI202590898",
        application_id:  "",
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
    
        // First check if it was passed via navigation state
        if (location.state?.applicationId) {
          applicationId = location.state.applicationId;
        }
        // If not, try to get it from localStorage
        else {
          applicationId = localStorage.getItem("applicationId") || "";
        }
        
        // Try to load saved form data from localStorage
        const savedFormData = localStorage.getItem(`previousLoans_${applicationId}`);
        
        if (savedFormData) {
          // Parse the saved data and set it to state
          const parsedData = JSON.parse(savedFormData);
          setFormData({
            ...parsedData,
            application_id: applicationId, // Ensure application_id is always set correctly
          });
        } else {
          // If no saved data, just set the application_id
          setFormData((prev) => ({
            ...prev,
            application_id: applicationId,
          }));
        }
    }, [location]);

    // Save form data to localStorage
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
        setError(""); // Clear any previous errors
        
        // Save to localStorage whenever form data changes
        saveToLocalStorage(updatedFormData);
    };

    const addLoan = () => {
        const updatedFormData = {
            ...formData,
            loan_data: [...formData.loan_data, {
                loan_account_no: "",
                loan_year: "",
                loan_amount: "",
                emi_amount: "",
                product: "",
                bank_name: ""
            }]
        };
        setFormData(updatedFormData);
        
        // Save to localStorage when adding a new loan
        saveToLocalStorage(updatedFormData);
    };

    const removeLoan = (index) => {
        if (formData.loan_data.length > 1) {
            const updatedLoanData = formData.loan_data.filter((_, idx) => idx !== index);
            const updatedFormData = { ...formData, loan_data: updatedLoanData };
            setFormData(updatedFormData);
            
            // Save to localStorage when removing a loan
            saveToLocalStorage(updatedFormData);
        }
    };

    const validateForm = () => {
        // Validation logic
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

        // Save current state to localStorage before submitting
        saveToLocalStorage(formData);
        
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3001/api/user-previous-loans/save",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Response:", response.data);
            setSuccess(true);

            // Navigate after short delay to show success message
            setTimeout(() => {
                navigate("/UserDocuments", {
                    state: { applicationId: formData.application_id }
                });
            }, 1500);

        } catch (err) {
            console.error("Error submitting:", err);
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

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-2xl mt-16 mb-16 border border-gray-100">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
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
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center">
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
                    <p>Previous loans submitted successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
                    Previous Loan Details
                </h2>

                {/* Application ID */}
                <div className="space-y-5">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                            Application ID
                        </label>
                        <input
                            type="text"
                            value={formData.application_id}
                            onChange={(e) => setFormData({...formData, application_id: e.target.value})}
                            placeholder="Application ID"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            
                        />
                    </div>
                </div>

                {formData.loan_data.map((loan, idx) => (
                    <div key={idx} className="space-y-5 p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Loan {idx + 1}
                            </h3>
                            {formData.loan_data.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLoan(idx)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                                >
                                    Remove this loan
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    Loan Account No<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={loan.loan_account_no}
                                    onChange={e => handleChange(idx, "loan_account_no", e.target.value)}
                                    placeholder="Loan Account No"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    Loan Year<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={loan.loan_year}
                                    onChange={e => handleChange(idx, "loan_year", e.target.value)}
                                    placeholder="YYYY"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    Loan Amount<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={loan.loan_amount}
                                    onChange={e => handleChange(idx, "loan_amount", e.target.value)}
                                    placeholder="Loan Amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    EMI Amount<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={loan.emi_amount}
                                    onChange={e => handleChange(idx, "emi_amount", e.target.value)}
                                    placeholder="EMI Amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    Product<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={loan.product}
                                    onChange={e => handleChange(idx, "product", e.target.value)}
                                    placeholder="Product"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                    Bank Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={loan.bank_name}
                                    onChange={e => handleChange(idx, "bank_name", e.target.value)}
                                    placeholder="Bank Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addLoan}
                    className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
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
                        className={`w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg 
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                    ></circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : (
                            "Save & Continue"
                        )}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row justify-between pt-4 text-sm text-blue-600">
                    <Link
                        to="/UserCoApplications"
                        className="mb-2 md:mb-0 hover:text-blue-800 transition-colors duration-200"
                    >
                        ← Back to Co-applicants
                    </Link>
                    <Link
                        to="/LoanReportDetail"
                        className="hover:text-blue-800 transition-colors duration-200"
                        state={{ applicationId: formData.application_id }}
                    >
                        Skip to Loan Report →
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UserPreviousData;