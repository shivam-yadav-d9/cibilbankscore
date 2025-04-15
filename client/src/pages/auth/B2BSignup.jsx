import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const B2BSignup = () => {
  const navigate = useNavigate();

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
      const res = await axios.post('http://localhost:3001/api/SignupRoutes/signup', formData);
      alert('Signup Successful! Your User ID: ' + res.data.userId);
      setError('');
      navigate('/business-dashboard'); // ✅ Navigate after success
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-blue-400">
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-md mx-auto bg-blue-300 rounded-xl shadow-lg space-y-6 mt-20"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Your Account</h2>

      <div>
        <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
        <input
          id="companyName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="companyName"
          onChange={handleChange}
          placeholder="Your Company's Name"
          required
        />
      </div>

      <div>
        <label htmlFor="businessType" className="block text-gray-700 text-sm font-bold mb-2">Business Type</label>
        <input
          id="businessType"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="businessType"
          onChange={handleChange}
          placeholder="e.g., Retail, Tech, Consulting"
          required
        />
      </div>

      <div>
        <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
        <input
          id="fullName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="fullName"
          onChange={handleChange}
          placeholder="Your Full Name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="email"
          onChange={handleChange}
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
        <input
          id="phone"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="phone"
          onChange={handleChange}
          placeholder="Your Phone Number"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          name="password"
          onChange={handleChange}
          placeholder="Choose a strong password"
          type="password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
      >
        Sign Up
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
    </div>
  );
};

export default B2BSignup;
