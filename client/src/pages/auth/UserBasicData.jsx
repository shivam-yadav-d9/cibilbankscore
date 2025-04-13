import axios from "axios";
import { useState } from "react";
//import { Link } from "react-router-dom"; // Removed unused import

function UserBasicData() {
const [formData, setFormData] = useState({
  name: "",
  mobile: "",
  email: "",
  dob: "",
  city: "",
  pincode: "",
  income_source: 1,
  monthly_income: "",
  loan_amount: "",
  pan: "",
  aadhaar: "",
  loan_type_id: "60",
  preferred_banks: [1, 2], 
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/loan/store", formData);  // Keep the full URL
      if (response.data.application_id) {
        alert("Application submitted! ID: " + response.data.application_id);
        localStorage.setItem("userBasicData", JSON.stringify(formData));
      } else {
        alert("Submission failed: " + (response.data.message || "Unknown error")); // Improved error message
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Something went wrong: " + (error.response?.data?.message || error.message || "Unknown error")); // Improved error handling
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg space-y-6 mt-16 mb-16"
    >
      <h2 className="text-2xl font-bold text-gray-700 text-center">
        Loan Application Form
      </h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="mobile"
        placeholder="Mobile"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="email"
        placeholder="Email"
        type="email" //added email type
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="dob"
        placeholder="DOB (YYYY-MM-DD)"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="pincode"
        placeholder="Pincode"
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
        <option value={1}>Salaried</option>
        <option value={2}>Self-Employed</option>
        <option value={3}>Other</option>
      </select>

      <input
        name="monthly_income"
        placeholder="Monthly Income"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="loan_amount"
        placeholder="Loan Amount"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="pan"
        placeholder="PAN"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="aadhaar"
        placeholder="Aadhaar Number"
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
        onChange={handleChange}
        value={formData.preferred_banks}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        save and Continue
      </button>
      {/* </Link> */}
    </form>

  );
}

export default UserBasicData;