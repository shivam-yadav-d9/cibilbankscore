import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserBasicData() {
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
  const[success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Format preferred_banks if it's a string
  //     const formattedData = {
  //       ...formData,
  //       preferred_banks: typeof formData.preferred_banks === 'string' 
  //         ? JSON.parse(formData.preferred_banks) 
  //         : formData.preferred_banks
  //     };

  //     const response = await axios.post(
  //       "http://localhost:3001/api/loan/store", 
  //       formattedData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     if (response.data.application_id) {
  //       alert("Application submitted successfully! ID: " + response.data.application_id);
  //       localStorage.setItem("userBasicData", JSON.stringify(formattedData));
  //       localStorage.setItem("applicationId", response.data.application_id);
  //     } else {
  //       throw new Error(response.data.message || "Failed to submit application");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting application:", error);
  //     setError(error.response?.data?.message || error.message || "Failed to submit application");
  //     alert("Error: " + (error.response?.data?.message || error.message || "Failed to submit application"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// Replace your existing handleSubmit function with this:
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Format preferred_banks if it's a string
    const formattedData = {
      ...formData,
      preferred_banks: typeof formData.preferred_banks === 'string' 
        ? JSON.parse(formData.preferred_banks) 
        : formData.preferred_banks
    };

    const response = await axios.post(
      "http://localhost:3001/api/loan/store", 
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.application_id) {
      // Store data in localStorage
      localStorage.setItem("userBasicData", JSON.stringify(formattedData));
      localStorage.setItem("applicationId", response.data.application_id);
      
      // Navigate to the UserAddress page with application ID
      navigate("/UserAddress", { 
        state: { applicationId: response.data.application_id } 
      });
      
      setSuccess("Application submitted successfully!");
    } else {
      throw new Error(response.data.message || "Failed to submit application");
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    setError(error.response?.data?.message || error.message || "Failed to submit application");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-16 mb-16">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          Loan Application Form
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="dob"
          placeholder="DOB (YYYY-MM-DD)"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="income_source"
          value={formData.income_source}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">Salaried</option>
          <option value="2">Self-Employed</option>
          <option value="3">Other</option>
        </select>

        <input
          name="monthly_income"
          placeholder="Monthly Income"
          value={formData.monthly_income}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="loan_amount"
          placeholder="Loan Amount"
          value={formData.loan_amount}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="pan"
          placeholder="PAN"
          value={formData.pan}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="loan_type_id"
          value={formData.loan_type_id}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="60">Personal Loan</option>
          <option value="61">Business Loan</option>
          <option value="62">Home Loan</option>
          <option value="63">Vehicle Loan</option>
        </select>

        <input
          name="preferred_banks"
          placeholder="Preferred Banks (e.g., [1,2])"
          value={formData.preferred_banks}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-3 rounded-lg shadow-md transition duration-300 ${
            isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Processing..." : "Save and Continue"}
        </button>
      </form>
    </div>
  );
}

export default UserBasicData;