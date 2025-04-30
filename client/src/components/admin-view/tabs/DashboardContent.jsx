import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContent = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [agentCount, setAgentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const [customersResponse, agentsResponse] = await Promise.all([
          axios.get('http://localhost:3001/user/users'),
          axios.get('http://localhost:3001/agent/agents'),
        ]);

        console.log("Customers response data:", customersResponse.data);
        console.log("Agents response data:", agentsResponse.data);

        setCustomerCount(customersResponse.data.users.length);
        setAgentCount(agentsResponse.data.length);

      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        console.log("Data fetching complete.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 md:p-12">
      {/* Hero Section */}
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-6 gap-8 flex-col-reverse md:flex-row text-center md:text-left mt-16">
        <div className="left md:w-1/2">
          <h1 className="text-2xl md:text-4xl text-crimson font-bold">
            Empowering Businesses to Manage Finances Seamlessly
          </h1>
          <p className="text-gray-800 text-base md:text-lg my-4 pt-2">
            Our B2B platform helps businesses scale by providing a comprehensive suite of financial tools, simplifying transactions, and accelerating growth.
          </p>
          <button className="text-white bg-crimson py-3 px-6 text-base md:text-lg rounded-lg hover:bg-red-700 transition mt-6">
            Get Started
          </button>
        </div>

        <div className="right md:w-1/2 mt-5 md:mt-0">
          <img src="/admin.png" alt="Hero Image" className="max-w-full w-full h-full object-cover rounded-lg shadow-xl" />
        </div>
      </div>

      {/* Loading/Error Handling */}
      {loading ? (
        <div className="text-center text-gray-500 text-xl">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-xl">Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Customer Card */}
          <div className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Total Customers</h2>
            <p className="text-4xl font-bold text-blue-600 animate-pulse">{customerCount}</p>
            <p className="text-gray-500 mt-2">Total number of registered customers</p>
          </div>

          {/* Agent Card */}
          <div className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Total Agents</h2>
            <p className="text-4xl font-bold text-green-600 animate-pulse">{agentCount}</p>
            <p className="text-gray-500 mt-2">Total number of active agents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
