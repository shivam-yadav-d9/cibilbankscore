import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserSecondAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [formData, setFormData] = useState({
    application_id: "",
    residential_status: "Resident",
    residence_type: "1",
    years_of_residence: "3",
    monthly_rent: "5000",
    ref_code: "OUI202590898",
    addresses: {
      present_address: {
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        email: "",
        phone: ""
      },
      permanent_address: {
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        email: "",
        phone: ""
      },
      office_address: {
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        email: "",
        phone: ""
      }
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

    // Try to load saved form data from localStorage
    const savedFormData = localStorage.getItem(`secondFormData_${applicationId}`);

    if (savedFormData) {
      // Parse the saved data and set it to state
      setFormData(JSON.parse(savedFormData));
    } else {
      // If no saved data, just set the application_id
      setFormData(prev => ({
        ...prev,
        application_id: applicationId
      }));
      
      // Only fetch from API if no saved data was found
      if (applicationId) {
        fetchExistingData(applicationId);
      }
    }
  }, [location]);

  const fetchExistingData = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user-second-address/${applicationId}`);
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      // If 404, it's a new application - no need to show error
      if (error.response && error.response.status !== 404) {
        console.error("Error fetching existing data:", error);
        setError("Error fetching data: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Handle change for basic form fields
  const handleChange = (e, addressType = null, field = null) => {
    let updatedFormData;
    
    if (addressType) {
      updatedFormData = {
        ...formData,
        addresses: {
          ...formData.addresses,
          [addressType]: {
            ...formData.addresses[addressType],
            [field]: e.target.value
          }
        }
      };
    } else {
      updatedFormData = { ...formData, [e.target.name]: e.target.value };
    }
    
    setFormData(updatedFormData);

    // Save to localStorage whenever form data changes
    if (updatedFormData.application_id) {
      localStorage.setItem(
        `secondFormData_${updatedFormData.application_id}`,
        JSON.stringify(updatedFormData)
      );
    }
  };

  // Handle "Same as Present Address" checkbox
  const handleSameAsPresent = (e) => {
    const isChecked = e.target.checked;
    setSameAsPresent(isChecked);
    
    if (isChecked) {
      // Copy present address to permanent address
      const updatedFormData = {
        ...formData,
        addresses: {
          ...formData.addresses,
          permanent_address: {
            ...formData.addresses.present_address
          }
        }
      };
      setFormData(updatedFormData);
      
      // Save to localStorage
      if (updatedFormData.application_id) {
        localStorage.setItem(
          `secondFormData_${updatedFormData.application_id}`,
          JSON.stringify(updatedFormData)
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError("");
    
    // Save the current state to localStorage before submitting
    if (formData.application_id) {
      localStorage.setItem(
        `secondFormData_${formData.application_id}`, 
        JSON.stringify(formData)
      );
    }
    
    try {
      const res = await axios.post("http://localhost:3001/api/user-second-address/save", formData);
      setSuccess("Address information saved successfully!");
      console.log(res.data);
      
      // Navigate programmatically after successful submission
      navigate("/UserCoApplications", { 
        state: { applicationId: formData.application_id } 
      });
    } catch (err) {
      console.error("Submit error:", err.message);
      setError("Error submitting form: " + (err.response?.data?.error || err.message));
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
          Address Details
        </h2>

        {/* Application ID */}
        <div className="space-y-5">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
              Application ID
            </label>
            <input
              name="application_id"
              type="text"
              value={formData.application_id}
              onChange={(e) => handleChange(e)}
              placeholder="Application ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Present Address Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Present Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.address_line1}
                onChange={(e) => handleChange(e, "present_address", "address_line1")}
                placeholder="Address Line 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.address_line2}
                onChange={(e) => handleChange(e, "present_address", "address_line2")}
                placeholder="Address Line 2"
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
                value={formData.addresses.present_address.address_line3}
                onChange={(e) => handleChange(e, "present_address", "address_line3")}
                placeholder="Address Line 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Pincode
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.pincode}
                onChange={(e) => handleChange(e, "present_address", "pincode")}
                placeholder="Pincode"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                City
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.city}
                onChange={(e) => handleChange(e, "present_address", "city")}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                State
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.state}
                onChange={(e) => handleChange(e, "present_address", "state")}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
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
                value={formData.addresses.present_address.landmark}
                onChange={(e) => handleChange(e, "present_address", "landmark")}
                placeholder="Landmark"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={formData.addresses.present_address.email}
                onChange={(e) => handleChange(e, "present_address", "email")}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Phone
              </label>
              <input
                type="text"
                value={formData.addresses.present_address.phone}
                onChange={(e) => handleChange(e, "present_address", "phone")}
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="space-y-5">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Permanent Address
            </h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={sameAsPresent}
                onChange={handleSameAsPresent}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="sameAsPresent" className="ml-2 text-sm font-medium text-gray-700">
                Same as Present Address
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.address_line1}
                onChange={(e) => handleChange(e, "permanent_address", "address_line1")}
                placeholder="Address Line 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.address_line2}
                onChange={(e) => handleChange(e, "permanent_address", "address_line2")}
                placeholder="Address Line 2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                disabled={sameAsPresent}
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
                value={formData.addresses.permanent_address.address_line3}
                onChange={(e) => handleChange(e, "permanent_address", "address_line3")}
                placeholder="Address Line 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                disabled={sameAsPresent}
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Pincode
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.pincode}
                onChange={(e) => handleChange(e, "permanent_address", "pincode")}
                placeholder="Pincode"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                City
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.city}
                onChange={(e) => handleChange(e, "permanent_address", "city")}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                State
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.state}
                onChange={(e) => handleChange(e, "permanent_address", "state")}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
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
                value={formData.addresses.permanent_address.landmark}
                onChange={(e) => handleChange(e, "permanent_address", "landmark")}
                placeholder="Landmark"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                disabled={sameAsPresent}
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={formData.addresses.permanent_address.email}
                onChange={(e) => handleChange(e, "permanent_address", "email")}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Phone
              </label>
              <input
                type="text"
                value={formData.addresses.permanent_address.phone}
                onChange={(e) => handleChange(e, "permanent_address", "phone")}
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={sameAsPresent}
              />
            </div>
          </div>
        </div>

        {/* Office Address Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Office Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.address_line1}
                onChange={(e) => handleChange(e, "office_address", "address_line1")}
                placeholder="Address Line 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.address_line2}
                onChange={(e) => handleChange(e, "office_address", "address_line2")}
                placeholder="Address Line 2"
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
                value={formData.addresses.office_address.address_line3}
                onChange={(e) => handleChange(e, "office_address", "address_line3")}
                placeholder="Address Line 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Pincode
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.pincode}
                onChange={(e) => handleChange(e, "office_address", "pincode")}
                placeholder="Pincode"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                City
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.city}
                onChange={(e) => handleChange(e, "office_address", "city")}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                State
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.state}
                onChange={(e) => handleChange(e, "office_address", "state")}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
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
                value={formData.addresses.office_address.landmark}
                onChange={(e) => handleChange(e, "office_address", "landmark")}
                placeholder="Landmark"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={formData.addresses.office_address.email}
                onChange={(e) => handleChange(e, "office_address", "email")}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Phone
              </label>
              <input
                type="text"
                value={formData.addresses.office_address.phone}
                onChange={(e) => handleChange(e, "office_address", "phone")}
                placeholder="Phone"
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
          to="/UserFirstForm"
          className="mb-2 md:mb-0 hover:text-blue-800 transition-colors duration-200"
        >
          ← Back to Personal Details
        </Link>
        <Link
          to="/UserCoApplications"
          className="hover:text-blue-800 transition-colors duration-200"
          state={{ applicationId: formData.application_id }}
        >
          Skip to Co-applicants →
        </Link>
      </div>
    </form>
  </div>
);
};

export default UserSecondAddress;