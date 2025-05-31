import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const UserSaveReferences = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    application_id: "",
    ref_code: import.meta.env.VITE_REF_CODE || "OUI2025107118",
    userId: "",
    userType: "",
    reference1: {
      name: "",
      relationship: "",
      email: "",
      phone: "",
      address: "",
    },
    reference2: {
      name: "",
      relationship: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    const applicationId = location.state?.applicationId || localStorage.getItem("applicationId") || "";
    const userId = location.state?.userId || localStorage.getItem("userId") || "";
    const userType = location.state?.userType || localStorage.getItem("userType") || "";
    const token = location.state?.token || localStorage.getItem("token") || ""; // Retrieve token

    // Save to localStorage for persistence
    if (applicationId) localStorage.setItem("applicationId", applicationId);
    if (userId) localStorage.setItem("userId", userId);
    if (userType) localStorage.setItem("userType", userType);
    if (token) localStorage.setItem("token", token);

    const savedFormData = localStorage.getItem(`references_${applicationId}`);
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

  const handleChange = (e, refType, field) => {
    const updatedFormData = {
      ...formData,
      [refType]: {
        ...formData[refType],
        [field]: e.target.value,
      },
    };
    setFormData(updatedFormData);

    if (updatedFormData.application_id) {
      localStorage.setItem(`references_${updatedFormData.application_id}`, JSON.stringify(updatedFormData));
    }

    setError("");
  };

  const validateForm = () => {
    const { reference1, reference2, application_id, userId, userType } = formData;
    if (!application_id) {
      setError("Application ID is required");
      return false;
    }
    if (!userId) {
      setError("User ID is required");
      return false;
    }
    if (!userType) {
      setError("User Type is required");
      return false;
    }
    if (!reference1.name || !reference1.relationship || !reference1.email || !reference1.phone) {
      setError("Please fill all required fields for Reference 1");
      return false;
    }
    if (!reference2.name || !reference2.relationship || !reference2.email || !reference2.phone) {
      setError("Please fill all required fields for Reference 2");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,}$/;

    if (!emailRegex.test(reference1.email)) {
      setError("Please provide a valid email address for Reference 1");
      return false;
    }
    if (!emailRegex.test(reference2.email)) {
      setError("Please provide a valid email address for Reference 2");
      return false;
    }
    if (!phoneRegex.test(reference1.phone.replace(/\D/g, ""))) {
      setError("Please provide a valid phone number for Reference 1 (at least 10 digits)");
      return false;
    }
    if (!phoneRegex.test(reference2.phone.replace(/\D/g, ""))) {
      setError("Please provide a valid phone number for Reference 2 (at least 10 digits)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    // Save current form state to localStorage
    if (formData.application_id) {
      localStorage.setItem(`references_${formData.application_id}`, JSON.stringify(formData));
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user-references/save`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            token, // Include token in headers
          },
        }
      );

      setSuccess("References submitted successfully!");

      setTimeout(() => {
        navigate("/UserPreviousData", {
          state: {
            applicationId: formData.application_id,
            userId: formData.userId,
            userType: formData.userType,
            token, // Pass token if needed
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.details ||
          err.message ||
          "Error submitting references. Please try again later."
      );
      window.scrollTo(0, 0);
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
    ? "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-400"
    : "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-600";

  const inputClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

  const buttonClass = isDarkMode
    ? "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1"
    : "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div
              className={isDarkMode
                ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-pulse"
                : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-pulse"}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div
              className={isDarkMode
                ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
                : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div
                  className={isDarkMode
                    ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                    : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"}
                ></div>
              </div>
              <h2 className={sectionTitleClass}>
                <span
                  className={isDarkMode
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}
                >
                  Personal References
                </span>
              </h2>
            </div>

            {/* Application ID */}
            <div className="group relative mb-8">
              <input
                name="application_id"
                type="text"
                value={formData.application_id}
                onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
                placeholder=" "
                className={inputClass}
                required
                readOnly
              />
              <label className={labelClass}>Application ID</label>
            </div>

            {/* Reference 1 Section */}
            <div className="space-y-5">
              <h3
                className={isDarkMode
                  ? "text-lg font-semibold text-indigo-300 border-b border-indigo-700 pb-2"
                  : "text-lg font-semibold text-indigo-600 border-b border-gray-200 pb-2"}
              >
                Reference 1
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <input
                    type="text"
                    value={formData.reference1.name}
                    onChange={(e) => handleChange(e, "reference1", "name")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Full Name</label>
                </div>
                <div className="group relative">
                  <input
                    type="text"
                    value={formData.reference1.relationship}
                    onChange={(e) => handleChange(e, "reference1", "relationship")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Relationship</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <input
                    type="email"
                    value={formData.reference1.email}
                    onChange={(e) => handleChange(e, "reference1", "email")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Email</label>
                </div>
                <div className="group relative">
                  <input
                    type="tel"
                    value={formData.reference1.phone}
                    onChange={(e) => handleChange(e, "reference1", "phone")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Phone</label>
                </div>
              </div>
              <div className="group relative">
                <input
                  type="text"
                  value={formData.reference1.address}
                  onChange={(e) => handleChange(e, "reference1", "address")}
                  placeholder=" "
                  className={inputClass}
                />
                <label className={labelClass}>Address (Optional)</label>
              </div>
            </div>

            {/* Reference 2 Section */}
            <div className="space-y-5">
              <h3
                className={isDarkMode
                  ? "text-lg font-semibold text-indigo-300 border-b border-indigo-700 pb-2"
                  : "text-lg font-semibold text-indigo-600 border-b border-gray-200 pb-2"}
              >
                Reference 2
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <input
                    type="text"
                    value={formData.reference2.name}
                    onChange={(e) => handleChange(e, "reference2", "name")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Full Name</label>
                </div>
                <div className="group relative">
                  <input
                    type="text"
                    value={formData.reference2.relationship}
                    onChange={(e) => handleChange(e, "reference2", "relationship")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Relationship</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <input
                    type="email"
                    value={formData.reference2.email}
                    onChange={(e) => handleChange(e, "reference2", "email")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Email</label>
                </div>
                <div className="group relative">
                  <input
                    type="tel"
                    value={formData.reference2.phone}
                    onChange={(e) => handleChange(e, "reference2", "phone")}
                    placeholder=" "
                    className={inputClass}
                    required
                  />
                  <label className={labelClass}>Phone</label>
                </div>
              </div>
              <div className="group relative">
                <input
                  type="text"
                  value={formData.reference2.address}
                  onChange={(e) => handleChange(e, "reference2", "address")}
                  placeholder=" "
                  className={inputClass}
                />
                <label className={labelClass}>Address (Optional)</label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`${buttonClass} ${isLoading ? "bg-gray-600 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
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
      </div>
    </div>
  );
};

export default UserSaveReferences;