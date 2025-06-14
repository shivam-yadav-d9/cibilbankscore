import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const UserAddress = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    ref_code: "OUI2025107118",
    application_id: "",
    userId: "",
    userType: "",
    first_name: "",
    middle_name: "",
    sur_name: "",
    gender: "",
    father_name: "",
    mother_name: "",
    marital_status: "",
    religion: "",
    qualification: "",
    current_emp_stability: "",
    total_emp_stability: "",
    industry_working: "",
    employer_name: "",
    designation: "",
    net_home_salary: "",
    salary_bank_account: "",
    bank_branch: "",
    account_type: "",
    salary_account_no: "",
    dependent: "",
    emi_towards: "",
    loan_amount: "",
    tenure: "",
    organization_type: "",
    loan_type: "",
    driving_licence_no: "",
    dl_valid_upto_date: "",
    designation_relation_with_company: "",
    vehicle_category: "",
    vehicle_type: "",
    manufacturer: "",
    vehicle_model: "",
    supplier: "",
    cost_of_vehicle: "",
    cost_of_insurance: "",
    cost_of_accessories: "",
  });

  useEffect(() => {
    const applicationId = location.state?.applicationId || localStorage.getItem("applicationId") || "";
    const userId = location.state?.userId || "";
    const userType = location.state?.userType || "";

    const savedFormData = localStorage.getItem(`formData_${applicationId}`);
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

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    if (updatedFormData.application_id) {
      localStorage.setItem(
        `formData_${updatedFormData.application_id}`,
        JSON.stringify(updatedFormData)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.application_id) {
      localStorage.setItem(`formData_${formData.application_id}`, JSON.stringify(formData));
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user-address/save-user-address`,
        formData
      );

      setSuccess("Submitted successfully");

      // ✅ Forward userId and userType
      navigate("/UserSecondAddress", {
        state: {
          applicationId: formData.application_id,
          userId: formData.userId,
          userType: formData.userType,
        },
      });
    } catch (err) {
      setError("Error submitting form: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Theme-based classes
  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

  const cardClass = isDarkMode
    ? "max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
    : "max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

  const innerClass = isDarkMode ? "p-8 md:p-12" : "p-8 md:p-12";

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
    ? "w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-500 hover:to-purple-500"
    : "w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700";

  // Helper for rendering input/select
  const renderInput = (name, label, type = "text", required = false) => (
    <div className="group relative">
      <input
        name={name}
        placeholder=" "
        type={type}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={inputClass}
      />
      <label className={labelClass}>{label}</label>
    </div>
  );

  const renderSelect = (name, label, options, required = false) => (
    <div className="group relative">
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={selectClass}
      >
        <option value="">{label}</option>
        {options.map((opt, index) =>
          typeof opt === 'string' ? (
            <option key={index} value={opt}>{opt}</option>
          ) : (
            <option key={index} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      <label className={labelClass}>{label}</label>
    </div>
  );


  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div className={isDarkMode
              ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center"}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className={isDarkMode
              ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
              : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className={isDarkMode
                  ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"}></div>
              </div>
              <h2 className={sectionTitleClass}>
                <span className={isDarkMode
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}>
                  Applicant Address & Details
                </span>
              </h2>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-500"}>
                Please fill in all required details
              </p>
            </div>

            {/* Section: Personal Details */}
            <div>
              <div className="flex items-center mb-6">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Personal Details
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderInput("application_id", "Application ID", "text", true)}
                {renderInput("first_name", "First Name", "text", true)}
                {renderInput("middle_name", "Middle Name")}
                {renderInput("sur_name", "Surname", "text", true)}
                {renderSelect("gender", "Gender", ["Male", "Female", "Other"], true)}
                {renderInput("father_name", "Father's Name", "text", true)}
                {renderInput("mother_name", "Mother's Name", "text", true)}
                {renderSelect("marital_status", "Marital Status", ["Single", "Married", "Divorced", "Widowed"], true)}
                {renderSelect("religion", "Religion", ["Hindu", "Muslim", "Christian", "Sikh", "Other"], true)}
                {renderSelect("qualification", "Qualification", ["High School(10th)", "intermediate(12th)", "Graduate", "Post-Graduate", "Diploma", "PhD", "Other"], true)}

              </div>
            </div>

            {/* Section: Employment Details */}
            <div>
              <div className="flex items-center mb-6 mt-10">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Employment Details
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSelect("current", "Current Job Duration", [
                  { label: "Less than 6 months", value: 3 },
                  { label: "6 months - 1 year", value: 9 },
                  { label: "1 - 2 years", value: 18 },
                  { label: "2 - 3 years", value: 30 },
                  { label: "More than 3 years", value: 48 }
                ], true)}

                {renderSelect("total_emp_stability", "Total Work Experience", [
                  { label: "Less than 1 year", value: 9 },
                  { label: "1 - 2 years", value: 18 },
                  { label: "2 - 3 years", value: 30 },
                  { label: "3 - 5 years", value: 48 },
                  { label: "More than 5 years", value: 72 }
                ], true)}

                {renderInput("industry_working", "Industry / Sector", "text", true)}
                {renderInput("employer_name", "Company Name", "text", true)}
                {renderInput("designation", "Job Title", "text", true)}
                {renderInput("net_home_salary", "Net Home Salary(Monthly )", "text", true)}

              </div>

            </div>

            <div>
              <div className="flex items-center mb-6 mt-10">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Bank Details
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSelect("salary_bank_account", "Select Salary Bank", [
                  { label: "State Bank of India (SBI)", value: 1 },
                  { label: "HDFC Bank", value: 2 },
                  { label: "ICICI Bank", value: 3 },
                  { label: "Axis Bank", value: 4 },
                  { label: "Punjab National Bank", value: 5 },
                  { label: "Other", value: 6 }
                ], true)}
                {renderInput("bank_branch", "Bank Branch Name", "text", true)}
                {renderSelect("account_type", "Select Account Type", [
                  { label: "Savings", value: "Savings" },
                  { label: "Current", value: "Current" },
                  { label: "Salary", value: "Salary" }
                ], true)}
                {renderInput("salary_account_no", "Salary Account Number", "text", true)}
                {renderSelect("dependent", "Number of Dependents", [
                  { label: "None", value: "0" },
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4 or more", value: "4" }
                ], true)}
                {renderSelect("emi_towards", "EMI Towards", ["Yes", "No"], true)}
              </div>
            </div>

            {/* Section: Loan Details */}
            <div>
              <div className="flex items-center mb-6 mt-10">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Loan Details
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderInput("loan_amount", "Loan Amount", "text", true)}
                {renderSelect("tenure", "Loan Tenure (in months)", [
                  "6", "12", "18", "24", "36", "48", "60"
                ], true)}
                {renderInput("organization_type", "Organization Type", "text", true)}
                {renderSelect("loan_type", "Loan Type", [
                  "HOME LOAN (SALARIED)",
                  "PERSONAL LOAN",
                  "VEHICLE LOAN",
                  "BUSINESS LOAN",
                  "EDUCATION LOAN",
                ], true)}
                {renderInput("driving_licence_no", "Driving Licence No", "text", true)}
                {renderInput("dl_valid_upto_date", "DL Valid Upto Date", "date", true)}
              </div>
            </div>

            {/* Section: Vehicle Details */}
            {/* <div>
              <div className="flex items-center mb-6 mt-10">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Vehicle Details
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderInput("designation_relation_with_company", "Designation Relation With Company", "text", true)}
                {renderInput("vehicle_category", "Vehicle Category", "text", true)}
                {renderInput("vehicle_type", "Vehicle Type", "text", true)}
                {renderInput("manufacturer", "Manufacturer", "text", true)}
                {renderInput("vehicle_model", "Vehicle Model", "text", true)}
                {renderInput("supplier", "Supplier", "text", true)}
                {renderInput("cost_of_vehicle", "Cost of Vehicle", "text", true)}
                {renderInput("cost_of_insurance", "Cost of Insurance", "text", true)}
                {renderInput("cost_of_accessories", "Cost of Accessories", "text", true)}
              </div>
            </div> */}

            <div className="pt-8">
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
                    Processing...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAddress;