import React, { useState } from "react";
import axios from "axios";

const AccountSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "", // Ensure email is included
    phoneNumber: user?.phoneNumber || "",
    pan: user?.pan || "",
    aadhar: user?.aadhar || "",
    dob: user?.dob || "",
    state: user?.state || "",
    address: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    creditScore: user?.creditScore || 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await axios.post("https://cibilbankscore-server-gamma.vercel.app/profile/update", formData);
      setSuccessMessage(res.data.message || "Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold  mb-2">
          Profile Settings
        </h1>
        <p className="text-slate-600 text-lg">
          Update your personal information and account details.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-900/50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Personal Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}  // Allow editing
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 "
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Credit Score
                </label>
                <input
                  type="number"
                  name="creditScore"
                  value={formData.creditScore || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>
            </div>


          </form>
        </div>
      </div>

      {/* ID Verification */}
      <div className="bg-slate-900/50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            ID Verification
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl flex items-start">
              <div className="mr-4 text-indigo-600 text-xl mt-1">🔒</div>
              <div>
                <h3 className="font-medium text-slate-900 mb-1">ID Security</h3>
                <p className="text-slate-600">
                  Your ID documents are encrypted and securely stored. We use
                  this information only for verification purposes as required by
                  regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-slate-900/50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-semibold  mb-6">
            Address Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                  />
                </div>



                {/* PIN Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900"
                  />
                </div>


                {/* Success message */}
                {successMessage && (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg border border-emerald-200">
                    {successMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/30 flex items-center group"
        >
          {isSubmitting ? "Saving Changes..." : "Save Profile Changes"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
