import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

function UserSecondAddress() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    application_id: "",
    userId: "", // Initialize with empty string
    userType: "", // Initialize with empty string
    ref_code: "OUI2025107118", // Get ref_code from location or default
    years_of_residence: "",
    residential_status: "Resident", // Add this field
    residence_type: "1", // Add this field with a default value
    monthly_rent: "",
    // Restructure formData to nest addresses under 'addresses' key
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
        phone: "",
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
        phone: "",
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
        phone: "",
      },
    },
  });


  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sameAsPresent, setSameAsPresent] = useState(false);

  useEffect(() => {
    // Get data from location state or localStorage
    const applicationId =
      location.state?.applicationId ||
      localStorage.getItem("applicationId") ||
      "";
    // Prioritize location.state, then check localStorage for userId and userType
    const userId = location.state?.userId || localStorage.getItem("userId") || "";
    const userType = location.state?.userType || localStorage.getItem("userType") || "";

    const refCode = location.state?.ref_code || "OUI202590898"; // Use default if not in location state

    const savedFormData = localStorage.getItem(
      `secondFormData_${applicationId}`
    );

    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      // When loading from localStorage, ensure addresses are correctly nested
      setFormData({
        ...parsedData,
        application_id: applicationId,
        userId: userId || parsedData.userId, // Use fetched userId if available, otherwise use saved data
        userType: userType || parsedData.userType, // Use fetched userType if available, otherwise use saved data
        ref_code: refCode, // Ensure ref_code is set
        // Ensure addresses are nested if not already
        addresses: parsedData.addresses || {
          present_address: parsedData.present_address || {},
          permanent_address: parsedData.permanent_address || {},
          office_address: parsedData.office_address || {},
        }
      });
      // Check if permanent address was same as present and update state
      if (JSON.stringify(parsedData.addresses?.permanent_address || {}) === JSON.stringify(parsedData.addresses?.present_address || {}) &&
        Object.keys(parsedData.addresses?.permanent_address || {}).length > 0 // Only check if there's actual data saved
      ) {
        setSameAsPresent(true);
      }

    } else {
      setFormData((prev) => ({
        ...prev,
        application_id: applicationId,
        userId: userId || prev.userId, // Use fetched userId if available
        userType: userType || prev.userType, // Use fetched userType if available
        ref_code: refCode, // Ensure ref_code is set
        // Ensure addresses are initialized nested
        addresses: {
          present_address: prev.addresses?.present_address || { address_line1: "", address_line2: "", address_line3: "", pincode: "", state: "", city: "", landmark: "", email: "", phone: "" },
          permanent_address: prev.addresses?.permanent_address || { address_line1: "", address_line2: "", address_line3: "", pincode: "", state: "", city: "", landmark: "", email: "", phone: "" },
          office_address: prev.addresses?.office_address || { address_line1: "", address_line2: "", address_line3: "", pincode: "", state: "", city: "", landmark: "", email: "", phone: "" },
        }
      }));
    }

    // Optionally save userId and userType to localStorage if they were found in location.state
    if (location.state?.userId) {
      localStorage.setItem("userId", location.state.userId);
    }
    if (location.state?.userType) {
      localStorage.setItem("userType", location.state.userType);
    }

  }, [location]); // Add location to dependency array

  const handleChange = (e, addressType = null, field = null) => {
    let updatedFormData;
    if (addressType) {
      // Update nested address fields correctly
      updatedFormData = {
        ...formData,
        addresses: {
          ...formData.addresses,
          [addressType]: {
            ...formData.addresses[addressType],
            [field]: e.target.value,
          },
        },
      };
    } else {
      // Handle top-level fields like years_of_residence, residential_status, etc.
      updatedFormData = { ...formData, [e.target.name]: e.target.value };
    }
    setFormData(updatedFormData);
    if (updatedFormData.application_id) {
      localStorage.setItem(
        `secondFormData_${updatedFormData.application_id}`,
        JSON.stringify(updatedFormData)
      );
    }
  };

  const handleSameAsPresent = (e) => {
    const isChecked = e.target.checked;
    setSameAsPresent(isChecked);
    if (isChecked) {
      // Copy present address to permanent address within the nested structure
      const updatedFormData = {
        ...formData,
        addresses: {
          ...formData.addresses,
          permanent_address: {
            ...formData.addresses.present_address,
          },
        },
      };
      setFormData(updatedFormData);
      if (updatedFormData.application_id) {
        localStorage.setItem(
          `secondFormData_${updatedFormData.application_id}`,
          JSON.stringify(updatedFormData)
        );
      }
    } else {
      // If unchecked, clear the permanent address fields
      const updatedFormData = {
        ...formData,
        addresses: {
          ...formData.addresses,
          permanent_address: {
            address_line1: "",
            address_line2: "",
            address_line3: "",
            pincode: "",
            state: "",
            city: "",
            landmark: "",
            email: "",
            phone: "",
          },
        },
      };
      setFormData(updatedFormData);
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
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Save current form data to localStorage before submitting
    if (formData.application_id) {
      localStorage.setItem(
        `secondFormData_${formData.application_id}`,
        JSON.stringify(formData)
      );
    }

    try {
      const authToken = localStorage.getItem('authToken'); // Retrieve the token

      // Log formData just before sending to verify structure and values
      console.log("Submitting formData:", formData);
      console.log("Sending token:", authToken);

      // Send the correctly structured formData directly to your backend
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user-second-address/save`,
        formData, // formData now has the correct nested 'addresses' structure
        {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the token in the Authorization header
            'Content-Type': 'application/json', // Specify content type
          }
        }
      );

      setSuccess("Address information saved successfully!");

      navigate("/UserCoApplications", {
        state: {
          applicationId: formData.application_id,
          userId: formData.userId, // Pass userId and userType to the next route
          userType: formData.userType,
        },
      });

    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message); // More detailed error logging
      // Check if the error response has a specific message for display
      const errorMessage = err.response?.data?.message || err.message;
      setError(
        "Error submitting form: " + errorMessage
      );
      // Do not set success to null here to show the error message
    } finally {
      setLoading(false);
    }
  };

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

  const buttonClass = isDarkMode
    ? "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1"
    : "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1";

  // Updated renderAddressFields to work with nested structure
  const renderAddressFields = (type, disabled = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].address_line1} // Access nested value
          onChange={(e) => handleChange(e, type, "address_line1")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>Address Line 1</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].address_line2} // Access nested value
          onChange={(e) => handleChange(e, type, "address_line2")}
          className={inputClass}
          required // Make address_line2 required
          disabled={disabled}
        />
        <label className={labelClass}>Address Line 2</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].address_line3} // Access nested value
          onChange={(e) => handleChange(e, type, "address_line3")}
          className={inputClass}
          disabled={disabled}
        />
        <label className={labelClass}>Address Line 3</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].pincode} // Access nested value
          onChange={(e) => handleChange(e, type, "pincode")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>Pincode</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].city} // Access nested value
          onChange={(e) => handleChange(e, type, "city")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>City</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].state} // Access nested value
          onChange={(e) => handleChange(e, type, "state")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>State</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].landmark} // Access nested value
          onChange={(e) => handleChange(e, type, "landmark")}
          className={inputClass}
          disabled={disabled}
        />
        <label className={labelClass}>Landmark</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].email} // Access nested value
          onChange={(e) => handleChange(e, type, "email")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>Email</label>
      </div>
      <div className="group relative">
        <input
          placeholder=" "
          value={formData.addresses[type].phone} // Access nested value
          onChange={(e) => handleChange(e, type, "phone")}
          className={inputClass}
          required
          disabled={disabled}
        />
        <label className={labelClass}>Phone</label>
      </div>
    </div>
  );

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
                  Address Details
                </span>
              </h2>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-500"}>Enter your addresses below</p>
            </div>

            {/* Application ID */}
            <div className="group relative mb-8">
              <input
                name="application_id"
                placeholder=" "
                value={formData.application_id}
                onChange={handleChange}
                required
                className={inputClass}
                readOnly
              />
              <label className={labelClass}>Application ID</label>
            </div>

            {/* userId Field (Hidden or Read-only) */}
            <div className="group relative mb-8" style={{ display: 'none' }}>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                readOnly // Make it read-only
                className={inputClass}
              />
              <label className={labelClass}>User ID</label>
            </div>

            {/* userType Field (Hidden or Read-only) */}
            <div className="group relative mb-8" style={{ display: 'none' }}>
              <input
                type="text"
                name="userType"
                value={formData.userType}
                readOnly // Make it read-only
                className={inputClass}
              />
              <label className={labelClass}>User Type</label>
            </div>

            {/* Residential Status */}
            <div className="group relative mb-8">
              <select
                name="residential_status"
                value={formData.residential_status}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Residential Status</option>
                <option value="Resident">Resident</option>
                <option value="Non-Resident">Non-Resident</option>
                <option value="NRI">NRI</option>
              </select>
              <label className={labelClass}>Residential Status</label>
            </div>

            {/* Residence Type (API needs numeric string) */}
            <div className="group relative mb-8">
              <select
                name="residence_type"
                value={formData.residence_type}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Residence Type</option>
                <option value="1">Owned</option>
                <option value="2">Rented</option>
                <option value="3">Company Provided</option>
                <option value="4">Parental</option>
              </select>
              <label className={labelClass}>Residence Type</label>
            </div>

            {/* Years of Residence */}
            <div className="group relative mb-8">
              <input
                type="number"
                name="years_of_residence"
                placeholder=" "
                value={formData.years_of_residence}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <label className={labelClass}>Years at Current Residence</label>
            </div>

            {/* Monthly Rent (if Rented) */}
            <div className="group relative mb-8">
              <input
                type="number"
                name="monthly_rent"
                placeholder=" "
                value={formData.monthly_rent}
                onChange={handleChange}
                className={inputClass}
              />
              <label className={labelClass}>Monthly Rent (if applicable)</label>
            </div>


            {/* Present Address */}
            <div>
              <div className="flex items-center mb-4">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Present Address
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              {renderAddressFields("present_address")}
            </div>

            {/* Permanent Address */}
            <div>
              <div className="flex items-center mb-4">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Permanent Address
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
                <div className="ml-4 flex items-center">
                  <input
                    type="checkbox"
                    id="sameAsPresent"
                    checked={sameAsPresent}
                    onChange={handleSameAsPresent}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                  />
                  <label htmlFor="sameAsPresent" className="ml-2 text-sm font-medium">
                    Same as Present Address
                  </label>
                </div>
              </div>
              {/* Pass disabled prop based on sameAsPresent state */}
              {renderAddressFields("permanent_address", sameAsPresent)}
            </div>

            {/* Office Address */}
            <div>
              <div className="flex items-center mb-4">
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"}></div>
                <h3 className={isDarkMode
                  ? "text-lg font-medium text-indigo-300 px-4 flex items-center"
                  : "text-lg font-medium text-indigo-600 px-4 flex items-center"}>
                  Office Address
                </h3>
                <div className={isDarkMode
                  ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                  : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"}></div>
              </div>
              {renderAddressFields("office_address")}
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSecondAddress;