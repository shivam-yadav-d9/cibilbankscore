import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserSaveReferences = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [formData, setFormData] = useState({
        application_id: "",
        ref_code: "OUI202590898",
        reference1: {
            name: "",
            relationship: "",
            email: "",
            phone: "",
            address: ""
        },
        reference2: {
            name: "",
            relationship: "",
            email: "",
            phone: "",
            address: ""
        }
    });

    useEffect(() => {
        // First check for application ID from navigation state or localStorage
        let applicationId = "";
        if (location.state?.applicationId) {
            applicationId = location.state.applicationId;
        } else {
            applicationId = localStorage.getItem("applicationId") || "";
        }

        // Try to load saved form data from localStorage
        const savedFormData = localStorage.getItem(`references_${applicationId}`);

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

    const handleChange = (e, refType, field) => {
        const updatedFormData = {
            ...formData,
            [refType]: {
                ...formData[refType],
                [field]: e.target.value
            }
        };
        
        setFormData(updatedFormData);
        
        // Save to localStorage whenever form data changes
        if (updatedFormData.application_id) {
            localStorage.setItem(
                `references_${updatedFormData.application_id}`,
                JSON.stringify(updatedFormData)
            );
        }
        
        // Clear any previous errors when user starts typing
        setError("");
    };

    const validateForm = () => {
        const { reference1, reference2 } = formData;
        
        if (!reference1.name || !reference1.relationship || !reference1.email || !reference1.phone) {
            setError("Please fill all required fields for Reference 1");
            return false;
        }
        
        if (!reference2.name || !reference2.relationship || !reference2.email || !reference2.phone) {
            setError("Please fill all required fields for Reference 2");
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(reference1.email)) {
            setError("Please provide a valid email address for Reference 1");
            return false;
        }
        if (!emailRegex.test(reference2.email)) {
            setError("Please provide a valid email address for Reference 2");
            return false;
        }
        
        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(reference1.phone.replace(/\D/g, ''))) {
            setError("Please provide a valid phone number for Reference 1 (at least 10 digits)");
            return false;
        }
        if (!phoneRegex.test(reference2.phone.replace(/\D/g, ''))) {
            setError("Please provide a valid phone number for Reference 2 (at least 10 digits)");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        // Save the current state to localStorage before submitting
        if (formData.application_id) {
            localStorage.setItem(`references_${formData.application_id}`, JSON.stringify(formData));
        }
        
        try {
            const response = await axios.post(
                "http://localhost:3001/api/user-references/save", 
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log("API Response:", response.data);
            setSuccess("References submitted successfully!");
            
            // Navigate after short delay to show success message
            setTimeout(() => {
                navigate("/UserPreviousData", {
                    state: { applicationId: formData.application_id }
                });
            }, 1500);
            
        } catch (err) {
            console.error("Error submitting references:", err);
            setError(
                err.response?.data?.error || 
                err.response?.data?.details || 
                "Error submitting references. Please try again later."
            );
            // Scroll to error message
            window.scrollTo(0, 0);
        } finally {
            setIsLoading(false);
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
                    <p>{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
                    Personal References
                </h2>

                {/* Application ID */}
                <div className="space-y-5">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                            Application ID
                        </label>
                        <input
                            name="application_id"
                            type="text"
                            value={formData.application_id}
                            onChange={(e) => setFormData({...formData, application_id: e.target.value})}
                            placeholder="Application ID"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                </div>

                {/* Reference 1 Section */}
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                        Reference 1
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.reference1.name}
                                onChange={(e) => handleChange(e, "reference1", "name")}
                                placeholder="Full Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Relationship
                            </label>
                            <input
                                type="text"
                                value={formData.reference1.relationship}
                                onChange={(e) => handleChange(e, "reference1", "relationship")}
                                placeholder="e.g. Friend, Colleague, Relative"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.reference1.email}
                                onChange={(e) => handleChange(e, "reference1", "email")}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.reference1.phone}
                                onChange={(e) => handleChange(e, "reference1", "phone")}
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                            Address (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.reference1.address}
                            onChange={(e) => handleChange(e, "reference1", "address")}
                            placeholder="Full Address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Reference 2 Section */}
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                        Reference 2
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.reference2.name}
                                onChange={(e) => handleChange(e, "reference2", "name")}
                                placeholder="Full Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Relationship
                            </label>
                            <input
                                type="text"
                                value={formData.reference2.relationship}
                                onChange={(e) => handleChange(e, "reference2", "relationship")}
                                placeholder="e.g. Friend, Colleague, Relative"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.reference2.email}
                                onChange={(e) => handleChange(e, "reference2", "email")}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.reference2.phone}
                                onChange={(e) => handleChange(e, "reference2", "phone")}
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                            Address (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.reference2.address}
                            onChange={(e) => handleChange(e, "reference2", "address")}
                            placeholder="Full Address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700"
                        }`}
                    >
                        {isLoading ? (
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
                                Saving...
                            </div>
                        ) : (
                            "Save & Continue"
                        )}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row justify-between pt-4 text-sm text-blue-600">
                    <Link
                        to="/previous-step"
                        className="mb-2 md:mb-0 hover:text-blue-800 transition-colors duration-200"
                    >
                        ← Back to Previous Step
                    </Link>
                    <Link
                        to="/UserPreviousData"
                        className="hover:text-blue-800 transition-colors duration-200"
                        state={{ applicationId: formData.application_id }}
                    >
                        Skip to Next Step →
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UserSaveReferences;