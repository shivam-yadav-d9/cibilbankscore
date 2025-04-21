import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserLoanPage = () => {
    const [loanTypes, setLoanTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await fetch("https://uat-api.evolutosolution.com/v1/loan/getLoanTypes");
                const data = await response.json();
                if (data.success) {
                    setLoanTypes(data.data);
                } else {
                    setError("Failed to fetch loan types");
                }
            } catch (err) {
                setError("Error fetching loan types");
            } finally {
                setLoading(false);
            }
        };

        fetchLoanTypes();
    }, []);

    const handleSelectLoan = (loanId) => {
        navigate(`/UserLoanInput`, { state: { loan_type_id: loanId } });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading available loan options...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-center text-gray-800">{error}</h2>
                    <p className="text-gray-600 text-center">Please try again later or contact support if the issue persists.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4 mt-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Select Your Loan Type</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our range of loan options tailored to meet your financial needs</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loanTypes.map((loan) => (
                        <div
                            key={loan.id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={`/${loan.name.replace(/\s+/g, '').toLowerCase()}.png`}
                                    alt={`${loan.name} Loan`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-loan.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">{loan.name}</h2>
                                <p className="text-gray-600 mb-6 line-clamp-2">
                                    {loan.description || `Apply for ${loan.name} and get competitive rates with flexible terms.`}
                                </p>
                                
                                <button
                                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                    onClick={() => handleSelectLoan(loan.id)}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {loanTypes.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-700">No loan options available</h3>
                        <p className="mt-2 text-gray-500">Please check back later for new loan products.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserLoanPage;