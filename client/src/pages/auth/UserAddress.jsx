import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserAddress = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898",
    application_id: "",
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

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    // First check for application ID (as you already do)
    let applicationId = "";
    if (location.state?.applicationId) {
      applicationId = location.state.applicationId;
    } else {
      applicationId = localStorage.getItem("applicationId") || "";
    }

    // Then try to load saved form data from localStorage
    const savedFormData = localStorage.getItem(`formData_${applicationId}`);

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

  // Modify your handleChange function
  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);

    // Save to localStorage whenever form data changes
    if (updatedFormData.application_id) {
      localStorage.setItem(
        `formData_${updatedFormData.application_id}`,
        JSON.stringify(updatedFormData)
      );
    }
  };

  // Modify your handleSubmit function to also save before submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Save the current state to localStorage before submitting
    if (formData.application_id) {
      localStorage.setItem(`formData_${formData.application_id}`, JSON.stringify(formData));
    }
    
    try {
      const res = await axios.post(
        "http://localhost:3001/api/user-address/save-user-address",
        formData
      );
      setSuccess("Submitted successfully");
      console.log(res.data);
      // Navigate programmatically after successful submission
      navigate("/UserSecondAddress", {
        state: { applicationId: formData.application_id },
      });
    } catch (err) {
      console.error(err);
      setError("Error submitting form: " + (err.response?.data?.message || err.message));
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
          Applicant Details
        </h2>

        {/* Personal Details Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Application ID
              </label>
              <input
                name="application_id"
                type="text"
                value={formData.application_id}
                onChange={handleChange}
                placeholder="Application ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                First Name
              </label>
              <input
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Middle Name
              </label>
              <input
                name="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Middle Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Surname
              </label>
              <input
                name="sur_name"
                type="text"
                value={formData.sur_name}
                onChange={handleChange}
                placeholder="Surname"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Father's Name
              </label>
              <input
                name="father_name"
                type="text"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Father's Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Mother's Name
              </label>
              <input
                name="mother_name"
                type="text"
                value={formData.mother_name}
                onChange={handleChange}
                placeholder="Mother's Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Religion
              </label>
              <input
                name="religion"
                type="text"
                value={formData.religion}
                onChange={handleChange}
                placeholder="Religion"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Qualification
              </label>
              <input
                name="qualification"
                type="text"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Employment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Current Employment Stability
              </label>
              <input
                name="current_emp_stability"
                type="text"
                value={formData.current_emp_stability}
                onChange={handleChange}
                placeholder="Current Employment Stability"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Total Employment Stability
              </label>
              <input
                name="total_emp_stability"
                type="text"
                value={formData.total_emp_stability}
                onChange={handleChange}
                placeholder="Total Employment Stability"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Industry Working
              </label>
              <input
                name="industry_working"
                type="text"
                value={formData.industry_working}
                onChange={handleChange}
                placeholder="Industry Working"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Employer Name
              </label>
              <input
                name="employer_name"
                type="text"
                value={formData.employer_name}
                onChange={handleChange}
                placeholder="Employer Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Designation
              </label>
              <input
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Net Home Salary
              </label>
              <input
                name="net_home_salary"
                type="text"
                value={formData.net_home_salary}
                onChange={handleChange}
                placeholder="Net Home Salary"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Bank Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Salary Bank Account
              </label>
              <input
                name="salary_bank_account"
                type="text"
                value={formData.salary_bank_account}
                onChange={handleChange}
                placeholder="Salary Bank Account"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Bank Branch
              </label>
              <input
                name="bank_branch"
                type="text"
                value={formData.bank_branch}
                onChange={handleChange}
                placeholder="Bank Branch"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Account Type
              </label>
              <input
                name="account_type"
                type="text"
                value={formData.account_type}
                onChange={handleChange}
                placeholder="Account Type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Salary Account No
              </label>
              <input
                name="salary_account_no"
                type="text"
                value={formData.salary_account_no}
                onChange={handleChange}
                placeholder="Salary Account No"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Dependent
              </label>
              <input
                name="dependent"
                type="text"
                value={formData.dependent}
                onChange={handleChange}
                placeholder="Dependent"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                EMI Towards
              </label>
              <select
                name="emi_towards"
                value={formData.emi_towards}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Details Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Loan Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Loan Amount
              </label>
              <input
                name="loan_amount"
                type="text"
                value={formData.loan_amount}
                onChange={handleChange}
                placeholder="Loan Amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Tenure
              </label>
              <input
                name="tenure"
                type="text"
                value={formData.tenure}
                onChange={handleChange}
                placeholder="Tenure"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Organization Type
              </label>
              <input
                name="organization_type"
                type="text"
                value={formData.organization_type}
                onChange={handleChange}
                placeholder="Organization Type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Loan Type
              </label>
              <input
                name="loan_type"
                type="text"
                value={formData.loan_type}
                onChange={handleChange}
                placeholder="Loan Type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Driving Licence No
              </label>
              <input
                name="driving_licence_no"
                type="text"
                value={formData.driving_licence_no}
                onChange={handleChange}
                placeholder="Driving Licence No"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                DL Valid Upto Date
              </label>
              <input
                name="dl_valid_upto_date"
                type="date"
                value={formData.dl_valid_upto_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Vehicle Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Designation Relation With Company
              </label>
              <input
                name="designation_relation_with_company"
                type="text"
                value={formData.designation_relation_with_company}
                onChange={handleChange}
                placeholder="Designation Relation With Company"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Vehicle Category
              </label>
              <input
                name="vehicle_category"
                type="text"
                value={formData.vehicle_category}
                onChange={handleChange}
                placeholder="Vehicle Category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Vehicle Type
              </label>
              <input
                name="vehicle_type"
                type="text"
                value={formData.vehicle_type}
                onChange={handleChange}
                placeholder="Vehicle Type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Manufacturer
              </label>
              <input
                name="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="Manufacturer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Vehicle Model
              </label>
              <input
                name="vehicle_model"
                type="text"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="Vehicle Model"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Supplier
              </label>
              <input
                name="supplier"
                type="text"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Supplier"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Cost of Vehicle
              </label>
              <input
                name="cost_of_vehicle"
                type="text"
                value={formData.cost_of_vehicle}
                onChange={handleChange}
                placeholder="Cost of Vehicle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Cost of Insurance
              </label>
              <input
                name="cost_of_insurance"
                type="text"
                value={formData.cost_of_insurance}
                onChange={handleChange}
                placeholder="Cost of Insurance"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Cost of Accessories
              </label>
              <input
                name="cost_of_accessories"
                type="text"
                value={formData.cost_of_accessories}
                onChange={handleChange}
                placeholder="Cost of Accessories"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
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
                Processing...
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserAddress;
