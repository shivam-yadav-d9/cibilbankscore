import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeButton, setActiveButton] = useState('our-customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (userType) => {
    setIsLoading(true);
    setError(null);
    setShowAll(false);

    try {
      let data = [];

      if (userType === 'our-customer') {
        const res = await axios.get("http://localhost:3001/dashboard/users");
        data = res.data;
      } else if (userType === 'agent-customer') {
        const res = await axios.get("http://localhost:3001/api/SignupRoutes/agents");
        data = res.data;
      } else if (userType === 'today-customer') {
        const [ourRes, agentRes] = await Promise.all([
          axios.get("http://localhost:3001/dashboard/users"),
          axios.get("http://localhost:3001/api/SignupRoutes/agents"),
        ]);
        const today = new Date().toISOString().split('T')[0];

        const todayUsers = [...ourRes.data, ...agentRes.data].filter(
          (user) => user.createdAt && user.createdAt.startsWith(today)
        );

        data = todayUsers;
      }

      setUsers(data);
      setVisibleUsers(data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(activeButton);
  }, [activeButton]);

  const handleButtonClick = (type) => {
    setActiveButton(type);
  };

  const handleViewAll = () => {
    setShowAll(true);
    setVisibleUsers(users);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Button Group */}
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-center gap-4">
        {['our-customer', 'agent-customer', 'today-customer'].map((type) => (
          <button
            key={type}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded ${
              activeButton === type ? 'opacity-100' : 'opacity-70'
            }`}
            onClick={() => handleButtonClick(type)}
            disabled={isLoading}
          >
            {type === 'our-customer'
              ? 'Our Customer'
              : type === 'agent-customer'
              ? 'Agent Customer'
              : 'Today Customer'}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {isLoading && <div className="text-center text-lg">Loading users...</div>}
      {error && <div className="text-center text-red-600">Error: {error}</div>}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-left text-gray-800">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-sm font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center px-6 py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              visibleUsers.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name || user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.createdAt ? formatDate(user.createdAt) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      {!showAll && users.length > 5 && (
        <div className="flex justify-center">
          <button
            onClick={handleViewAll}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-lg"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
