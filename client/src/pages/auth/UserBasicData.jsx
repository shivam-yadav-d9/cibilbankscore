import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserBasicData() {
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
    loan_type_id: "60",
    preferred_banks: "[1, 2]",
  });

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const previousFormData = localStorage.getItem("loanProcessorFormData");

    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    if (previousFormData) {
      const parsedData = JSON.parse(previousFormData);
      // Update UserBasicData form with matching fields from LoanProcessor
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
        // You can add more fields here if they're available in user data
      }));
    }
  }, [navigate]);

  // Replace your existing handleSubmit function with this:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format preferred_banks if it's a string
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
        // Store data in localStorage
        localStorage.setItem("userBasicData", JSON.stringify(formattedData));
        localStorage.setItem("applicationId", response.data.application_id);

        // Navigate to the UserAddress page with application ID
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

  return (
    /* Tailwind CSS styling for modern UserBasicData form */

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
          Loan Application Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="space-y-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Name
                </label>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Mobile
                </label>
                <input
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Location Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  City
                </label>
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Pincode
                </label>
                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="space-y-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Financial Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Income Source
                </label>
                <select
                  name="income_source"
                  value={formData.income_source}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="1">Salaried</option>
                  <option value="2">Self-Employed</option>
                  <option value="3">Other</option>
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
                  Monthly Income
                </label>
                <input
                  name="monthly_income"
                  placeholder="Monthly Income"
                  value={formData.monthly_income}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Loan Type
                </label>
                <select
                  name="loan_type_id"
                  value={formData.loan_type_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="60">Personal Loan</option>
                  <option value="61">Business Loan</option>
                  <option value="62">Home Loan</option>
                  <option value="63">Vehicle Loan</option>
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
                  Loan Amount
                </label>
                <input
                  name="loan_amount"
                  placeholder="Loan Amount"
                  value={formData.loan_amount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* ID Information Section */}
          <div className="space-y-5 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              ID Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  PAN Number
                </label>
                <input
                  name="pan"
                  placeholder="PAN Number"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Aadhaar Number
                </label>
                <input
                  name="aadhaar"
                  placeholder="Aadhaar Number"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Preferred Banks Section */}
          <div className="md:col-span-2">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Preferred Banks
              </label>
              <input
                name="preferred_banks"
                placeholder="Preferred Banks (e.g., [1,2])"
                value={formData.preferred_banks}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                Processing...
              </div>
            ) : (
              "Save and Continue"
            )}
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 pt-4">
          <div className="h-2 w-8 rounded-full bg-blue-600"></div>
          <div className="h-2 w-8 rounded-full bg-gray-300"></div>
          <div className="h-2 w-8 rounded-full bg-gray-300"></div>
        </div>
      </form>
    </div>
  );
}

export default UserBasicData;
