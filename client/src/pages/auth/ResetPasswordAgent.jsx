import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Import useNavigate for navigation
import axios from 'axios';

const ResetPasswordAgent = () => {
    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const { token } = useParams();   // Getting token from URL params

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/agent/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/LoginAgent'); // Redirect to login after success
            }, 2000);
        } catch (err) {
            console.error('Reset Password Error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display server error
            } else {
                setError('Error resetting password. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-96 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                {success && <div className="text-green-500 text-center mb-4">Password successfully reset! Redirecting...</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordAgent;