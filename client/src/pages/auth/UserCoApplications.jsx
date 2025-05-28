import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Adjust path as needed

const UserCoApplications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

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
    ref_code: "OUI2025107118",
    userId: "",
    userType: "",
  });

  useEffect(() => {
    const fetchCoApplicantData = async (applicationId) => {
      try {
        setIsLoading(true);
        const axiosConfig = {
          baseURL: import.meta.env.VITE_BACKEND_URL,
          headers: {
            "Content-Type": "application/json",
          },
        };

        // const response = await axios.get(
        //   `/api/user-co-app/${applicationId}`,
        //   axiosConfig
        // );
        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
          localStorage.setItem(
            `coAppFormData_${applicationId}`,
            JSON.stringify(response.data.data)
          );
        }
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          setError("Failed to load co-applicant data: " + err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    let applicationId = "";
    if (location.state?.applicationId) {
      applicationId = location.state.applicationId;
    } else {
      applicationId =
        localStorage.getItem("applicationId") ||
        sessionStorage.getItem("application_id") ||
        "";
    }

    if (applicationId) {
      localStorage.setItem("applicationId", applicationId);

      const savedFormData = localStorage.getItem(
        `coAppFormData_${applicationId}`
      );

      const userId =
      location.state?.userId || localStorage.getItem("userId") || "";
    const userType =
      location.state?.userType || localStorage.getItem("userType") || "";
    

      if (savedFormData) {
        setFormData({
          ...JSON.parse(savedFormData),
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

    if (formData.application_id) {
      localStorage.setItem(
        `coAppFormData_${formData.application_id}`,
        JSON.stringify(formData)
      );
    }

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
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Pincode must be exactly 6 digits");
      setIsLoading(false);
      return;
    }

    try {
      const axiosConfig = {
        baseURL: import.meta.env.VITE_BACKEND_URL,
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
        setSuccess(res.data.message || "Co-applicant information saved successfully");

        navigate("/UserSaveRefrences", {
          state: {
            applicationId: formData.application_id,
            userId: formData.userId,
            userType: formData.userType,
          },
        });
      } else {
        throw new Error(
          res.data.message || "Failed to save co-applicant information"
        );
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error occurred";
        setError(`Submission failed: ${errorMessage}`);
      } else if (err.request) {
        setError(
          "Unable to reach the server. Please check your internet connection and try again."
        );
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Theme-based classes
  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

  const cardClass = isDarkMode
    ? "max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
    : "max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

  const innerClass = isDarkMode ? "p-8 md:p-12" : "p-8 md:p-12";

  const sectionTitleClass = isDarkMode
    ? "text-3xl font-bold text-white mb-2"
    : "text-3xl font-bold text-gray-900 mb-2";

  const labelClass = isDarkMode
    ? "absolute -top-2.5 left-3 bg-slate-900 px-1 text-xs font-medium text-indigo-300"
    : "absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600";

  const inputClass = isDarkMode
    ? "w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
    : "w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200";

  const selectClass = isDarkMode
    ? "w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
    : "w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200";

  const buttonClass = isDarkMode
    ? "w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-500 hover:to-purple-500"
    : "w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div className={isDarkMode
              ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center"}>
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
            <div className={isDarkMode
              ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center"}>
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
              <h2 className={sectionTitleClass + " text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8"}>
                Co-Applicant Information
              </h2>

              {formData.application_id && (
                <div className="space-y-5">
                  <div className="relative">
                    <label className={labelClass}>
                      Application ID
                    </label>
                    <div className={inputClass + " bg-gray-50"}>
                      {formData.application_id}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="relative">
                  <label className={labelClass}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <label className={labelClass}>
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    required
                    className={selectClass}
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
                  <label className={labelClass}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label className={labelClass}>
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
                    className={inputClass}
                  />
                </div>
              </div>

              <h3 className={isDarkMode
                ? "text-lg font-semibold text-indigo-300 border-b border-indigo-700 pb-2 mt-6"
                : "text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mt-6"}>
                Address Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelClass}>
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    placeholder="Building/Flat No, Street"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label className={labelClass}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    placeholder="Area, Locality"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelClass}>
                    Address Line 3
                  </label>
                  <input
                    type="text"
                    name="address_line3"
                    value={formData.address_line3}
                    onChange={handleChange}
                    placeholder="Additional Address Info"
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label className={labelClass}>
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
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelClass}>
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label className={labelClass}>
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelClass}>
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby Landmark"
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <label className={labelClass}>
                    Alternate Number
                  </label>
                  <input
                    type="tel"
                    name="alternate_no"
                    value={formData.alternate_no}
                    onChange={handleChange}
                    placeholder="Alternate Phone Number"
                    pattern="[0-9]{10}"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <label className={labelClass}>
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    className={selectClass}
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
                  className={`${buttonClass} ${isLoading ? "bg-gray-600 cursor-not-allowed" : ""}`}
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
      </div>
    </div>
  );
};

export default UserCoApplications;