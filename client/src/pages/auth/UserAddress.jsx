import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898",
    application_id: "",
    first_name: "Mahesh",
    middle_name: "Narayan",
    sur_name: "Waghmare",
    gender: "Male",
    father_name: "Narayan",
    mother_name: "Suman",
    marital_status: "Married",
    religion: "Hindu",
    qualification: "Post-Graduate",
    current_emp_stability: "1",
    total_emp_stability: "1",
    industry_working: "Software",
    employer_name: "Test Company",
    designation: "Software Developer",
    net_home_salary: "150000",
    salary_bank_account: "4",
    bank_branch: "Noida",
    account_type: "Savings",
    salary_account_no: "1234567890",
    dependent: "5",
    emi_towards: "No",
    loan_amount: "100000",
    tenure: "12",
    organization_type: "Public Limited",
    loan_type: "HOME LOAN (SALARIED)",
    driving_licence_no: "DL-1234-5678",
    dl_valid_upto_date: "2028-01-01",
    designation_relation_with_company: "Software Developer",
    vehicle_category: "LMV",
    vehicle_type: "Sedan",
    manufacturer: "Hyundai",
    vehicle_model: "Verna 2019",
    supplier: "ABC Motors",
    cost_of_vehicle: "1000000",
    cost_of_insurance: "50000",
    cost_of_accessories: "10000",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/user-address/save-user-address",
        formData
      );
      alert("Submitted successfully");
      console.log(res.data);
      // Navigate programmatically after successful submission
      // If using react-router v6
      navigate("/UserSecondAddress", { state: { applicationId: formData.application_id } });
    } catch (err) {
      console.error(err);
      alert("Error submitting form: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-20 mb-20">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Applicant Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <h3 className="text-xl font-semibold text-gray-700">
            Personal Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="application_id"
              >
                Application ID (for testing)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="application_id"
                name="application_id"
                type="text"
                value={formData.application_id} // Add this line to bind the value
                placeholder="Application ID"
                onChange={handleChange}
                required
              />
            </div>
            {/* First Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="first_name"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="first_name"
                value={formData.first_name}
                name="first_name"
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
            </div>
            {/* Middle Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="middle_name"
              >
                Middle Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.middle_name}
                id="middle_name"
                name="middle_name"
                type="text"
                placeholder="Middle Name"
                onChange={handleChange}
              />
            </div>
            {/* Surname */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="sur_name"
              >
                Surname
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sur_name"
                value={formData.sur_name}
                name="sur_name"
                type="text"
                placeholder="Surname"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Gender */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gender"
                name="gender"
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Father's Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="father_name"
              >
                Father's Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="father_name"
                name="father_name"
                type="text"
                value={formData.father_name}
                placeholder="Father's Name"
                onChange={handleChange}
                required
              />
            </div>
            {/* Mother's Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="mother_name"
              >
                Mother's Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="mother_name"
                name="mother_name"
                type="text"
                value={formData.mother_name}
                placeholder="Mother's Name"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Marital Status */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="marital_status"
              >
                Marital Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="marital_status"
                name="marital_status"
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            {/* Religion */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="religion"
              >
                Religion
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="religion"
                name="religion"
                type="text"
                value={formData.religion}
                placeholder="Religion"
                onChange={handleChange}
                required
              />
            </div>
            {/* Qualification */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="qualification"
              >
                Qualification
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="qualification"
                name="qualification"
                type="text"
                value={formData.qualification}
                placeholder="Qualification"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Employment Details */}
          <h3 className="text-xl font-semibold text-gray-700 mt-6">
            Employment Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Current Employment Stability */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="current_emp_stability"
              >
                Current Employment Stability
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="current_emp_stability"
                name="current_emp_stability"
                type="text"
                value={formData.current_emp_stability}
                placeholder="Current Employment Stability"
                onChange={handleChange}
                required
              />
            </div>
            {/* Total Employment Stability */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="total_emp_stability"
              >
                Total Employment Stability
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="total_emp_stability"
                name="total_emp_stability"
                type="text"
                value={formData.total_emp_stability}
                placeholder="Total Employment Stability"
                onChange={handleChange}
                required
              />
            </div>
            {/* Industry Working */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="industry_working"
              >
                Industry Working
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="industry_working"
                name="industry_working"
                type="text"
                placeholder="Industry Working"
                value={formData.industry_working}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Employer Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="employer_name"
              >
                Employer Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="employer_name"
                name="employer_name"
                type="text"
                placeholder="Employer Name"
                value={formData.employer_name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Designation */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="designation"
              >
                Designation
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="designation"
                name="designation"
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
            {/* Net Home Salary */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="net_home_salary"
              >
                Net Home Salary
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="net_home_salary"
                name="net_home_salary"
                type="text"
                placeholder="Net Home Salary"
                onChange={handleChange}
                value={formData.net_home_salary}
                required
              />
            </div>
          </div>

          {/* Bank Details */}
          <h3 className="text-xl font-semibold text-gray-700 mt-6">
            Bank Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Salary Bank Account */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="salary_bank_account"
              >
                Salary Bank Account
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salary_bank_account"
                name="salary_bank_account"
                type="text"
                placeholder="Salary Bank Account"
                onChange={handleChange}
                value={formData.salary_bank_account}
                required
              />
            </div>
            {/* Bank Branch */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bank_branch"
              >
                Bank Branch
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="bank_branch"
                name="bank_branch"
                type="text"
                placeholder="Bank Branch"
                onChange={handleChange}
                value={formData.bank_branch}
                required
              />
            </div>
            {/* Account Type */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="account_type"
              >
                Account Type
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="account_type"
                name="account_type"
                type="text"
                placeholder="Account Type"
                onChange={handleChange}
                value={formData.account_type}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Salary Account No */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="salary_account_no"
              >
                Salary Account No
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salary_account_no"
                name="salary_account_no"
                type="text"
                placeholder="Salary Account No"
                onChange={handleChange}
                value={formData.salary_account_no}
                required
              />
            </div>
            {/* Dependent */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dependent"
              >
                Dependent
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dependent"
                name="dependent"
                type="text"
                placeholder="Dependent"
                onChange={handleChange}
                value={formData.dependent}
                required
              />
            </div>
            {/* EMI Towards */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="emi_towards"
              >
                EMI Towards
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="emi_towards"
                name="emi_towards"
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Loan Details */}
          <h3 className="text-xl font-semibold text-gray-700 mt-6">
            Loan Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Loan Amount */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="loan_amount"
              >
                Loan Amount
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="loan_amount"
                name="loan_amount"
                type="text"
                placeholder="Loan Amount"
                onChange={handleChange}
                value={formData.loan_amount}
                required
              />
            </div>
            {/* Tenure */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="tenure"
              >
                Tenure
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tenure"
                name="tenure"
                type="text"
                placeholder="Tenure"
                onChange={handleChange}
                value={formData.tenure}
                required
              />
            </div>
            {/* Organization Type */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="organization_type"
              >
                Organization Type
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="organization_type"
                name="organization_type"
                type="text"
                placeholder="Organization Type"
                onChange={handleChange}
                value={formData.organization_type}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Loan Type */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="loan_type"
              >
                Loan Type
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="loan_type"
                name="loan_type"
                type="text"
                placeholder="Loan Type"
                onChange={handleChange}
                value={formData.loan_type}
                required
              />
            </div>
            {/* Driving Licence No */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="driving_licence_no"
              >
                Driving Licence No
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="driving_licence_no"
                name="driving_licence_no"
                type="text"
                value={formData.driving_licence_no}
                placeholder="Driving Licence No"
                onChange={handleChange}
                required
              />
            </div>
            {/* DL Valid Upto Date */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dl_valid_upto_date"
              >
                DL Valid Upto Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dl_valid_upto_date"
                name="dl_valid_upto_date"
                type="date"
                value={formData.dl_valid_upto_date}
                placeholder="DL Valid Upto Date"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Vehicle Details */}
          <h3 className="text-xl font-semibold text-gray-700 mt-6">
            Vehicle Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Designation Relation with Company */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="designation_relation_with_company"
              >
                Designation Relation With Company
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="designation_relation_with_company"
                name="designation_relation_with_company"
                type="text"
                placeholder="Designation Relation With Company"
                onChange={handleChange}
                value={formData.designation_relation_with_company}
                required
              />
            </div>
            {/* Vehicle Category */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="vehicle_category"
              >
                Vehicle Category
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="vehicle_category"
                name="vehicle_category"
                type="text"
                placeholder="Vehicle Category"
                value={formData.vehicle_category}
                onChange={handleChange}
                required
              />
            </div>
            {/* Vehicle Type */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="vehicle_type"
              >
                Vehicle Type
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="vehicle_type"
                name="vehicle_type"
                type="text"
                placeholder="Vehicle Type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Manufacturer */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="manufacturer"
              >
                Manufacturer
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="manufacturer"
                name="manufacturer"
                type="text"
                value={formData.manufacturer}
                placeholder="Manufacturer"
                onChange={handleChange}
                required
              />
            </div>
            {/* Vehicle Model */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="vehicle_model"
              >
                Vehicle Model
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="vehicle_model"
                name="vehicle_model"
                type="text"
                value={formData.vehicle_model}
                placeholder="Vehicle Model"
                onChange={handleChange}
                required
              />
            </div>
            {/* Supplier */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="supplier"
              >
                Supplier
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="supplier"
                name="supplier"
                type="text"
                value={formData.supplier}
                placeholder="Supplier"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Cost of Vehicle */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cost_of_vehicle"
              >
                Cost of Vehicle
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cost_of_vehicle"
                name="cost_of_vehicle"
                type="text"
                placeholder="Cost of Vehicle"
                onChange={handleChange}
                value={formData.cost_of_vehicle}
                required
              />
            </div>
            {/* Cost of Insurance */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cost_of_insurance"
              >
                Cost of Insurance
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cost_of_insurance"
                name="cost_of_insurance"
                type="text"
                placeholder="Cost of Insurance"
                onChange={handleChange}
                value={formData.cost_of_insurance}
                required
              />
            </div>
            {/* Cost of Accessories */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cost_of_accessories"
              >
                Cost of Accessories
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cost_of_accessories"
                name="cost_of_accessories"
                type="text"
                placeholder="Cost of Accessories"
                onChange={handleChange}
                value={formData.cost_of_accessories}
                required
              />
            </div>
          </div>
          {/* Submit Button */}
         
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          
        </form>
      </div>
    </div>
  );
};

export default UserAddress;
