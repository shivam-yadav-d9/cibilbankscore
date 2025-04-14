import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UserCoApplications = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        application_id: "",
        name: "",
        relationship: "",
        email: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        alternate_no: "",
        occupation: "",
        ref_code: "OUI202590898"
    });
    
    // Optional: Get application_id from sessionStorage if available
    useEffect(() => {
        const storedAppId = sessionStorage.getItem("application_id");
        if (storedAppId) {
            setFormData(prev => ({...prev, application_id: storedAppId}));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... existing code ...
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        const requiredFields = {
            name: 'Name',
            relationship: 'Relationship',
            email: 'Email',
            phone: 'Phone',
            address_line1: 'Address Line 1',
            pincode: 'Pincode',
            state: 'State',
            city: 'City',
            occupation: 'Occupation'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !formData[key])
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Validate phone number format
        if (!/^\d{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits");
            return;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validate pincode
        if (!/^\d{6}$/.test(formData.pincode)) {
            alert("Pincode must be exactly 6 digits");
            return;
        }
        
        try {
            // Configure axios with base URL and headers
            const axiosConfig = {
                baseURL: 'http://localhost:3001',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const res = await axios.post("/api/user-co-app/save", formData, axiosConfig);
            
            if (res.data && res.data.success) {
                alert(res.data.message || "Co-applicant information saved successfully");
                navigate("/UserSaveRefrences");
            } else {
                throw new Error(res.data.message || "Failed to save co-applicant information");
            }
        } catch (err) {
            console.error("Error submitting:", err);
            
            // Handle different types of errors
            if (err.response) {
                // Server responded with an error
                const errorMessage = err.response.data?.message || err.response.data?.error || "Server error occurred";
                alert(`Submission failed: ${errorMessage}`);
            } else if (err.request) {
                // Request was made but no response received
                alert("Unable to reach the server. Please check your internet connection and try again.");
            } else {
                // Something else went wrong
                alert(`Error: ${err.message || "Unknown error occurred"}`);
            }
        }
    };
// ... existing code ...

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-20 mb-20">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Co-Applicant Information</h2>
            
            {formData.application_id && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Application ID:</label>
                    <div className="py-2 px-3 bg-gray-100 rounded">{formData.application_id}</div>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name: <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    id="name"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship: <span className="text-red-500">*</span></label>
                <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    id="relationship"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email: <span className="text-red-500">*</span></label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    id="email"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone: <span className="text-red-500">*</span></label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit Phone Number"
                    id="phone"
                    required
                    pattern="[0-9]{10}"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <small className="text-gray-500">Format: 10 digits, no spaces or dashes</small>
            </div>

            <div className="mb-4">
                <label htmlFor="address_line1" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1: <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    placeholder="Building/Flat No, Street"
                    id="address_line1"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address_line2" className="block text-gray-700 text-sm font-bold mb-2">Address Line 2:</label>
                <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    placeholder="Area, Locality"
                    id="address_line2"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address_line3" className="block text-gray-700 text-sm font-bold mb-2">Address Line 3:</label>
                <input
                    type="text"
                    name="address_line3"
                    value={formData.address_line3}
                    onChange={handleChange}
                    placeholder="Additional Address Info"
                    id="address_line3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode: <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit Pincode"
                    id="pincode"
                    required
                    pattern="[0-9]{6}"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State: <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    id="state"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City: <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    id="city"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="landmark" className="block text-gray-700 text-sm font-bold mb-2">Landmark:</label>
                <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby Landmark"
                    id="landmark"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="alternate_no" className="block text-gray-700 text-sm font-bold mb-2">Alternate Number:</label>
                <input
                    type="tel"
                    name="alternate_no"
                    value={formData.alternate_no}
                    onChange={handleChange}
                    placeholder="Alternate Phone Number"
                    id="alternate_no"
                    pattern="[0-9]{10}"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="occupation" className="block text-gray-700 text-sm font-bold mb-2">Occupation: <span className="text-red-500">*</span></label>
                <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    id="occupation"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Occupation</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Homemaker">Homemaker</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save and Continue
                </button>
                
                <Link to="/" className="text-blue-500 hover:text-blue-700">
                    Cancel
                </Link>
            </div>
        </form>
    );
};

export default UserCoApplications;