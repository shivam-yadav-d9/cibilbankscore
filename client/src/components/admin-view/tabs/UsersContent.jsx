import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersContent = () => {
    const [users, setUsers] = useState([]);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [activeButton, setActiveButton] = useState('our-customer');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);  // Current page number
    const [totalPages, setTotalPages] = useState(1);    // Total number of pages
    const [pageSize, setPageSize] = useState(10);        // Number of records per page

    const fetchUsers = async (userType, startDate = '', endDate = '', page = 1, pageSize = 10) => {
        setIsLoading(true);
        setError(null);
        setShowAll(false);
      
        try {
          let data = [];
          let apiUrl = '';
      
          if (userType === 'our-customer') {
            apiUrl = `${import.meta.env.VITE_BACKEND_URL}/user/users?page=${page}&pageSize=${pageSize}`;  // Added page and pageSize
            if (startDate && endDate) {
              apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
            }
            const res = await axios.get(apiUrl);
            data = res.data.users;
            setTotalPages(res.data.totalPages);      // Update totalPages
            setCurrentPage(res.data.currentPage);  // Update current page
          } else if (userType === 'agent-customer') {
            apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents`;
            const res = await axios.get(apiUrl);
            data = res.data;
          } else if (userType === 'today-customer') {
            const [ourRes, agentRes] = await Promise.all([
              axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/users`),
              axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents`),
            ]);
            const today = new Date().toISOString().split('T')[0];
      
            const todayUsers = [
              ...ourRes.data.users,
              ...agentRes.data
            ].filter((user) => user.createdAt && user.createdAt.startsWith(today));
      
            data = todayUsers;
          }
      
          setUsers(data);
          setVisibleUsers(data); // No slicing, display all users on the current page
        } catch (err) {
          console.error("Error fetching users:", err);
          setError(err.message || "An error occurred while fetching data.");
        } finally {
          setIsLoading(false);
        }
      };
      

    useEffect(() => {
        fetchUsers(activeButton, startDate, endDate, currentPage, pageSize);  // Fetch users with pagination
    }, [activeButton, startDate, endDate, currentPage, pageSize]);  // Refetch when these change

    const handleButtonClick = (type) => {
        setActiveButton(type);
        setCurrentPage(1);  // Reset to page 1 when the button changes
    };

    const handleViewAll = () => {
        setShowAll(true); // Show all users (if you still want this functionality)
        setVisibleUsers(users);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format date
    };

    const getMobile = (user) => {
        return (
            user.mobile ||
            user.mobileNumber ||
            user.contactNumber ||
            user.phone ||
            user.phoneNumber ||
            '—' // Default if no mobile info
        );
    };

    const handleDateSearch = () => {
        if (startDate && endDate) {
            setCurrentPage(1);  // Reset to page 1 when a new date search is performed
            fetchUsers('our-customer', startDate, endDate, currentPage, pageSize);
        } else {
            alert('Please enter both start and end dates.');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Date Range Search */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center gap-4">
                <label htmlFor="startDate" className="text-gray-700">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    className="border rounded p-2"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label htmlFor="endDate" className="text-gray-700">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    className="border rounded p-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button
                    onClick={handleDateSearch}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                >
                    Search by Date
                </button>
            </div>

            {/* Button Group */}
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-center gap-4">
                {['our-customer', 'agent-customer', 'today-customer'].map((type) => (
                    <button
                        key={type}
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded ${activeButton === type ? 'opacity-100' : 'opacity-70'
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
                            <th className="px-6 py-3 text-sm font-semibold">Mobile</th>
                            <th className="px-6 py-3 text-sm font-semibold">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center px-6 py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            visibleUsers.map((user, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{user.name || user.fullName || '—'}</td>
                                    <td className="px-6 py-4">{user.email || '—'}</td>
                                    <td className="px-6 py-4">{getMobile(user)}</td>
                                    <td className="px-6 py-4">
                                        {user.createdAt ? formatDate(user.createdAt) : '—'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Previous
                </button>

                {/* Display page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 ${currentPage === page ? 'bg-blue-200' : ''}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Next
                </button>
            </div>

            {/* View All Button (Consider Removing or Adapting) */}
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