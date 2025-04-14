import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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
    
        setFormData((prev) => ({
          ...prev,
          application_id: applicationId,
        }));
      }, [location]);

    const handleChange = (index, field, value) => {
        const updatedLoanData = [...formData.loan_data];
        updatedLoanData[index][field] = value;
        setFormData({ ...formData, loan_data: updatedLoanData });
        setError(""); // Clear any previous errors
    };

    const addLoan = () => {
        setFormData({
            ...formData,
            loan_data: [...formData.loan_data, {
                loan_account_no: "",
                loan_year: "",
                loan_amount: "",
                emi_amount: "",
                product: "",
                bank_name: ""
            }]
        });
    };

    const removeLoan = (index) => {
        if (formData.loan_data.length > 1) {
            const updatedLoanData = formData.loan_data.filter((_, idx) => idx !== index);
            setFormData({ ...formData, loan_data: updatedLoanData });
        }
    };

    const validateForm = () => {
        // if (!formData.application_id) {
        //     setError("Application ID is missing. Please ensure you're properly logged in.");
        //     return false;
        // }

        for (let i = 0; i < formData.loan_data.length; i++) {
            const loan = formData.loan_data[i];
            if (!loan.loan_account_no || !loan.loan_year || !loan.loan_amount || 
                !loan.emi_amount || !loan.product || !loan.bank_name) {
                setError(`Please fill all fields for Loan ${i + 1}`);
                return false;
            }

            // Validate loan year
            const year = parseInt(loan.loan_year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1900 || year > currentYear) {
                setError(`Invalid loan year for Loan ${i + 1}`);
                return false;
            }

            // Validate amounts
            if (isNaN(parseFloat(loan.loan_amount)) || parseFloat(loan.loan_amount) <= 0) {
                setError(`Invalid loan amount for Loan ${i + 1}`);
                return false;
            }
            if (isNaN(parseFloat(loan.emi_amount)) || parseFloat(loan.emi_amount) <= 0) {
                setError(`Invalid EMI amount for Loan ${i + 1}`);
                return false;
            }
        }

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
                navigate("/next-step");
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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Previous Loan Details</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Previous loans submitted successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 rounded-lg shadow-md p-6">
                {formData.loan_data.map((loan, idx) => (
                    <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Loan {idx + 1}</h3>
                            {formData.loan_data.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLoan(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label htmlFor={`loan_account_no-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    Loan Account No:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id={`loan_account_no-${idx}`}
                                    placeholder="Loan Account No"
                                    value={loan.loan_account_no}
                                    onChange={e => handleChange(idx, "loan_account_no", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`loan_year-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    Loan Year:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id={`loan_year-${idx}`}
                                    placeholder="YYYY"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={loan.loan_year}
                                    onChange={e => handleChange(idx, "loan_year", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`loan_amount-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    Loan Amount:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id={`loan_amount-${idx}`}
                                    placeholder="Loan Amount"
                                    min="0"
                                    step="0.01"
                                    value={loan.loan_amount}
                                    onChange={e => handleChange(idx, "loan_amount", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`emi_amount-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    EMI Amount:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id={`emi_amount-${idx}`}
                                    placeholder="EMI Amount"
                                    min="0"
                                    step="0.01"
                                    value={loan.emi_amount}
                                    onChange={e => handleChange(idx, "emi_amount", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`product-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    Product:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id={`product-${idx}`}
                                    placeholder="Product"
                                    value={loan.product}
                                    onChange={e => handleChange(idx, "product", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`bank_name-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                                    Bank Name:<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id={`bank_name-${idx}`}
                                    placeholder="Bank Name"
                                    value={loan.bank_name}
                                    onChange={e => handleChange(idx, "bank_name", e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={addLoan}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Another Loan
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserPreviousData;