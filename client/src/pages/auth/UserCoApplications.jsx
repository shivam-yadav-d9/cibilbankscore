import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const UserCoApplications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    ref_code: "OUI202590898",
  });

  // Get application_id and load data
  useEffect(() => {
    const fetchCoApplicantData = async (applicationId) => {
      try {
        setIsLoading(true);
        const axiosConfig = {
          baseURL: "http://localhost:3001",
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.get(
          `/api/user-co-app/${applicationId}`,
          axiosConfig
        );
        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
          // Save to localStorage for persistence
          localStorage.setItem(
            `coAppFormData_${applicationId}`, 
            JSON.stringify(response.data.data)
          );
        }
      } catch (err) {
        // If 404, it means no record exists yet, which is fine
        if (err.response && err.response.status !== 404) {
          setError("Failed to load co-applicant data: " + err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Get application ID from various sources
    let applicationId = "";

    if (location.state?.applicationId) {
      applicationId = location.state.applicationId;
    } else {
      // Try getting from localStorage or sessionStorage
      applicationId =
        localStorage.getItem("applicationId") ||
        sessionStorage.getItem("application_id") ||
        "";
    }

    if (applicationId) {
      // Save the application ID to localStorage
      localStorage.setItem("applicationId", applicationId);

      // Check for saved form data in localStorage
      const savedFormData = localStorage.getItem(`coAppFormData_${applicationId}`);
      
      if (savedFormData) {
        // If we have saved form data, use it
        setFormData(JSON.parse(savedFormData));
      } else {
        // Otherwise, just set the application_id and try to fetch from server
        setFormData((prev) => ({
          ...prev,
          application_id: applicationId,
        }));
        
        // Try to fetch existing data for this application ID
        fetchCoApplicantData(applicationId);
      }
    } else {
      setError(
        "No application ID found. Please start from the beginning of the application process."
      );
    }
  }, [location]);

  const handleChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    
    setFormData(updatedFormData);
    
    // Save to localStorage whenever form data changes
    if (updatedFormData.application_id) {
      localStorage.setItem(
        `coAppFormData_${updatedFormData.application_id}`,
        JSON.stringify(updatedFormData)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Save the current state to localStorage before submitting
    if (formData.application_id) {
      localStorage.setItem(
        `coAppFormData_${formData.application_id}`, 
        JSON.stringify(formData)
      );
    }

    // Validate form data
    const requiredFields = {
      name: "Name",
      relationship: "Relationship",
      email: "Email",
      phone: "Phone",
      address_line1: "Address Line 1",
      pincode: "Pincode",
      state: "State",
      city: "City",
      occupation: "Occupation",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      setIsLoading(false);
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Pincode must be exactly 6 digits");
      setIsLoading(false);
      return;
    }

    try {
      // Configure axios with base URL and headers
      const axiosConfig = {
        baseURL: "http://localhost:3001",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "/api/user-co-app/save",
        formData,
        axiosConfig
      );

      if (res.data && res.data.success) {
        setSuccess(
          res.data.message || "Co-applicant information saved successfully"
        );

        // After successful submission, clear the form data from localStorage
        // This is optional - you might want to keep it for back navigation
        // localStorage.removeItem(`coAppFormData_${formData.application_id}`);

        // Navigate programmatically after successful submission
        navigate("/UserSaveRefrences", {
          state: { applicationId: formData.application_id },
        });
      } else {
        throw new Error(
          res.data.message || "Failed to save co-applicant information"
        );
      }
    } catch (err) {
      console.error("Error submitting:", err);

      // Handle different types of errors
      if (err.response) {
        // Server responded with an error
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error occurred";
        setError(`Submission failed: ${errorMessage}`);
      } else if (err.request) {
        // Request was made but no response received
        setError(
          "Unable to reach the server. Please check your internet connection and try again."
        );
      } else {
        // Something else went wrong
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
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

      {isLoading && !formData.application_id ? (
        <div className="flex items-center justify-center py-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
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
          <span className="ml-2">Loading application data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
            Co-Applicant Information
          </h2>

          {formData.application_id && (
            <div className="space-y-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Application ID
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.application_id}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit Phone Number"
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          

          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mt-6">
            Address Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="Building/Flat No, Street"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 2
              </label>
              <input
                type="text"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                placeholder="Area, Locality"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 3
              </label>
              <input
                type="text"
                name="address_line3"
                value={formData.address_line3}
                onChange={handleChange}
                placeholder="Additional Address Info"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit Pincode"
                required
                pattern="[0-9]{6}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby Landmark"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Alternate Number
              </label>
              <input
                type="tel"
                name="alternate_no"
                value={formData.alternate_no}
                onChange={handleChange}
                placeholder="Alternate Phone Number"
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Occupation <span className="text-red-500">*</span>
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
          </div>

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

          <div className="flex flex-col md:flex-row justify-between pt-4 text-sm text-blue-600">
            <Link
              to="/UserSecondAddress"
              className="mb-2 md:mb-0 hover:text-blue-800 transition-colors duration-200"
            >
              ← Back to Address Details
            </Link>
            <Link
              to="/UserSaveRefrences"
              className="hover:text-blue-800 transition-colors duration-200"
              state={{ applicationId: formData.application_id }}
            >
              Skip to References →
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserCoApplications;