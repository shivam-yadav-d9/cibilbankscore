import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserSaveReferences = () => {
    const navigate = useNavigate();
    const location = useLocation;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    
    // Get application_id from localStorage or another source
    // const applicationId = localStorage.getItem("application_id") || "";
    
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

    const handleChange = (e, refType, field) => {
        setFormData(prev => ({
            ...prev,
            [refType]: {
                ...prev[refType],
                [field]: e.target.value
            }
        }));
        // Clear any previous errors when user starts typing
        setError("");
    };

    const validateForm = () => {
        // if (!formData.application_id) {
        //     setError("Application ID is missing. Please ensure you're properly logged in.");
        //     return false;
        // }

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
        setSuccess(false);
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
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
            setSuccess(true);
            
            // Navigate after short delay to show success message
            setTimeout(() => {
                navigate("/UserPreviousData");
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
            setLoading(false);
        }
    };

    // Rest of the component remains the same...
    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h1 className="text-2xl font-bold text-center mb-6">Personal References</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    References submitted successfully!
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reference 1 Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Reference 1</h2>

                    <div className="mb-4">
                        <label htmlFor="ref1_name" className="block text-gray-700 text-sm font-bold mb-2">Name:<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="ref1_name"
                            placeholder="Full Name"
                            value={formData.reference1.name}
                            onChange={e => handleChange(e, "reference1", "name")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref1_relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="ref1_relationship"
                            placeholder="e.g. Friend, Colleague, Relative"
                            value={formData.reference1.relationship}
                            onChange={e => handleChange(e, "reference1", "relationship")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref1_email" className="block text-gray-700 text-sm font-bold mb-2">Email:<span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="ref1_email"
                            placeholder="email@example.com"
                            value={formData.reference1.email}
                            onChange={e => handleChange(e, "reference1", "email")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref1_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:<span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            id="ref1_phone"
                            placeholder="Phone Number"
                            value={formData.reference1.phone}
                            onChange={e => handleChange(e, "reference1", "phone")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref1_address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                        <input
                            type="text"
                            id="ref1_address"
                            placeholder="Full Address"
                            value={formData.reference1.address}
                            onChange={e => handleChange(e, "reference1", "address")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                {/* Reference 2 Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Reference 2</h2>

                    <div className="mb-4">
                        <label htmlFor="ref2_name" className="block text-gray-700 text-sm font-bold mb-2">Name:<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="ref2_name"
                            placeholder="Full Name"
                            value={formData.reference2.name}
                            onChange={e => handleChange(e, "reference2", "name")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref2_relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="ref2_relationship"
                            placeholder="e.g. Friend, Colleague, Relative"
                            value={formData.reference2.relationship}
                            onChange={e => handleChange(e, "reference2", "relationship")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref2_email" className="block text-gray-700 text-sm font-bold mb-2">Email:<span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="ref2_email"
                            placeholder="email@example.com"
                            value={formData.reference2.email}
                            onChange={e => handleChange(e, "reference2", "email")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref2_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:<span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            id="ref2_phone"
                            placeholder="Phone Number"
                            value={formData.reference2.phone}
                            onChange={e => handleChange(e, "reference2", "phone")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ref2_address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                        <input
                            type="text"
                            id="ref2_address"
                            placeholder="Full Address"
                            value={formData.reference2.address}
                            onChange={e => handleChange(e, "reference2", "address")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link to="/previous-step" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Back
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Save and Continue'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserSaveReferences;