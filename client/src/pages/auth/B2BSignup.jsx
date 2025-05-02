import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const B2BSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/signup`, formData);

      // Create a user object with business type
      const userData = {
        ...res.data,
        userType: 'business', // Explicitly set user type
        token: res.data.token,
        email: formData.email,
        companyName: formData.companyName
      };

      // Use the login function from AuthContext to set the authentication state
      login(userData);
      
      setError('');  // Clear any previous error messages
      navigate('/business-dashboard');
    } catch (err) {
      // Check if the error message is from the backend (email or phone already exists)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);  // Set the error message from the backend
      } else {
        setError('Signup failed. Please try again.');  // Default error message
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6 mt-10"
      >
        <h2 className="text-3xl font-bold text-white text-center tracking-tight">
          Create Your Account
        </h2>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-indigo-100 text-sm font-medium mb-2">
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            onChange={handleChange}
            placeholder="Your Company's Name"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-indigo-100 text-sm font-medium mb-2">
            Business Type
          </label>
          <input
            id="businessType"
            name="businessType"
            onChange={handleChange}
            placeholder="e.g., Retail, Tech, Consulting"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-indigo-100 text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            onChange={handleChange}
            placeholder="Your Full Name"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-indigo-100 text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-indigo-100 text-sm font-medium mb-2">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            onChange={handleChange}
            placeholder="Your Phone Number"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-indigo-100 text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Choose a strong password"
            required
            className="w-full px-4 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>

        {/* Footer Text */}
        <p className="text-sm text-indigo-200 text-center">
          Already have an account?{" "}
          <Link to="/LoginAgent" className="font-medium text-indigo-400 hover:text-white">
            Sign in
          </Link>
        </p>

        {error && <p className="text-red-300 text-sm text-center">{error}</p>}
      </form>
    </div>

  );
};

export default B2BSignup;
