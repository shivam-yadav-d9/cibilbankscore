import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Adjust path as needed

function UserBasicData() {
  const location = useLocation();
  const loanTypeId = location.state?.loan_type_id;
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    city: "",
    pincode: "",
    income_source: "1",
    monthly_income: "",
    loan_amount: "",
    pan: "",
    aadhaar: "",
    loan_type_id: loanTypeId,
    preferred_banks: "[1, 2]",
  });

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const previousFormData = localStorage.getItem("loanProcessorFormData");

    if (!token) {
      navigate("/login");
      return;
    }

    if (previousFormData) {
      const parsedData = JSON.parse(previousFormData);
      setFormData((prev) => ({
        ...prev,
        dob: parsedData.dob || prev.dob,
        monthly_income: parsedData.monthly_income || prev.monthly_income,
        pincode: parsedData.pincode || prev.pincode,
        mobile: parsedData.mobile || prev.mobile,
        pan: parsedData.pan_no || prev.pan,
        aadhaar: parsedData.aadhaar_no || prev.aadhaar,
        loan_amount: parsedData.loan_amount || prev.loan_amount,
      }));
    }

    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      }));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedData = {
        ...formData,
        preferred_banks:
          typeof formData.preferred_banks === "string"
            ? JSON.parse(formData.preferred_banks)
            : formData.preferred_banks,
      };

      const response = await axios.post(
        "http://localhost:3001/api/loan/store",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.application_id) {
        localStorage.setItem("userBasicData", JSON.stringify(formattedData));
        localStorage.setItem("applicationId", response.data.application_id);

        navigate("/UserAddress", {
          state: { applicationId: response.data.application_id },
        });

        setSuccess("Application submitted successfully!");
      } else {
        throw new Error(
          response.data.message || "Failed to submit application"
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit application"
      );
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

  const innerClass = isDarkMode
    ? "p-8 md:p-12"
    : "p-8 md:p-12";

  const sectionTitleClass = isDarkMode
    ? "text-4xl font-bold text-white mb-2"
    : "text-4xl font-bold text-gray-900 mb-2";

  const labelClass = isDarkMode
    ? "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-400"
    : "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-600";

  const inputClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

  const selectClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

  const buttonClass = isDarkMode
    ? "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1"
    : "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div className={isDarkMode
              ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-pulse"
              : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-pulse"}>
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
              ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"}>
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
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className={isDarkMode
                  ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"}></div>
              </div>
              <h2 className={sectionTitleClass}>
                <span className={isDarkMode
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}>
                  Loan Application
                </span>
              </h2>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-500"}>Complete your basic details to proceed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information Section */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center">
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                  <h3 className={isDarkMode
                    ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                    : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h3>
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      name="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      Full Name
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      name="email"
                      placeholder=" "
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      name="mobile"
                      placeholder=" "
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                    <label className={labelClass}>
                      Mobile Number
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={isDarkMode
                      ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium"
                      : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                      Date of Birth
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center">
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                  <h3 className={isDarkMode
                    ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                    : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location Details
                  </h3>
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      name="city"
                      placeholder=" "
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                    <label className={labelClass}>
                      City
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      name="pincode"
                      placeholder=" "
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      Pincode
                    </label>
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center">
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                  <h3 className={isDarkMode
                    ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                    : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Financial Details
                  </h3>
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <select
                      name="income_source"
                      value={formData.income_source}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="1">Salaried</option>
                      <option value="2">Self-Employed</option>
                      <option value="3">Other</option>
                    </select>
                    <label className={isDarkMode
                      ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium"
                      : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                      Income Source
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="group relative">
                    <input
                      name="monthly_income"
                      placeholder=" "
                      value={formData.monthly_income}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                    <label className={labelClass}>
                      Monthly Income
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <select
                      name="loan_type_id"
                      value={formData.loan_type_id}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="60">Personal Loan</option>
                      <option value="61">Business Loan</option>
                      <option value="62">Home Loan</option>
                      <option value="117">Vehicle Loan</option>
                    </select>
                    <label className={isDarkMode
                      ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium"
                      : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                      Loan Type
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="group relative">
                    <input
                      name="loan_amount"
                      placeholder=" "
                      value={formData.loan_amount}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      Loan Amount
                    </label>
                  </div>
                </div>
              </div>

              {/* ID Information Section */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center">
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                  <h3 className={isDarkMode
                    ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                    : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    ID Details
                  </h3>
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      name="pan"
                      placeholder=" "
                      value={formData.pan}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      PAN Number
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      name="aadhaar"
                      placeholder=" "
                      value={formData.aadhaar}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      readOnly
                    />
                    <label className={labelClass}>
                      Aadhaar Number
                    </label>
                  </div>
                </div>
              </div>

              {/* Preferred Banks Section */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                  <h3 className={isDarkMode
                    ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                    : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Preferred Banks
                  </h3>
                  <div className={isDarkMode
                    ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                    : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                </div>
                <div className="group relative">
                  <input
                    name="preferred_banks"
                    placeholder=" "
                    value={formData.preferred_banks}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <label className={labelClass}>
                    Preferred Banks (e.g., [1,2])
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`${buttonClass} ${isLoading ? "bg-gray-600 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Save and Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center items-center space-x-2 pt-4">
              <div className={isDarkMode
                ? "h-2 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                : "h-2 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"}></div>
              <div className={isDarkMode
                ? "h-2 w-12 rounded-full bg-slate-600/50"
                : "h-2 w-12 rounded-full bg-gray-200"}></div>
              <div className={isDarkMode
                ? "h-2 w-12 rounded-full bg-slate-600/50"
                : "h-2 w-12 rounded-full bg-gray-200"}></div>
              <div className={isDarkMode
                ? "text-xs text-slate-400 ml-2"
                : "text-xs text-gray-400 ml-2"}>Step 1 of 3</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserBasicData;