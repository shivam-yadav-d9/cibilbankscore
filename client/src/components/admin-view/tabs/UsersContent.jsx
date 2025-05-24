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

    const [loanDetails, setLoanDetails] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [authToken, setAuthToken] = useState(null);

    const fetchUsers = async (userType, startDate = '', endDate = '', page = 1, pageSize = 10) => {
        setIsLoading(true);
        setError(null);
        setShowAll(false);

        try {
            let data = [];
            let apiUrl = '';

            if (userType === 'our-customer') {
                apiUrl = `${import.meta.env.VITE_BACKEND_URL}/user/users?page=${page}&pageSize=${pageSize}`;
                if (startDate && endDate) {
                    apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
                }
                const res = await axios.get(apiUrl);
                data = res.data.users;
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
            } else if (userType === 'agent-customer') {
                apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents`;
                const res = await axios.get(apiUrl);
                data = res.data;
                // console.log(data)
                setTotalPages(1);
            } else if (userType === 'today-customer') {
                const [ourRes, agentRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/users`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents`),
                ]);
                const today = new Date().toISOString().split('T')[0];
                const todayUsers = [...ourRes.data.users, ...agentRes.data].filter(
                    (user) => user.createdAt && user.createdAt.startsWith(today)
                );
                data = todayUsers;
                setTotalPages(1);
            }

            setUsers(data);
            setVisibleUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message || "An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(activeButton, startDate, endDate, currentPage, pageSize);
    }, [activeButton, startDate, endDate, currentPage, pageSize]);

    const handleButtonClick = (type) => {
        setActiveButton(type);
        setCurrentPage(1);
        setLoanDetails(null);
        setSelectedUserId(null);
    };

    const handleViewAll = () => {
        setShowAll(true);
        setVisibleUsers(users);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getMobile = (user) =>
        user.mobile ||
        user.mobileNumber ||
        user.contactNumber ||
        user.phone ||
        user.phoneNumber ||
        '—';

    const handleDateSearch = () => {
        if (startDate && endDate) {
            setCurrentPage(1);
            fetchUsers('our-customer', startDate, endDate, currentPage, pageSize);
        } else {
            alert('Please enter both start and end dates.');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setLoanDetails(null);
        setSelectedUserId(null);
    };

    const fetchLoanDetails = async (userId, userType) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/loan/details`, {
                params: { userId, userType },
            });
            // console.log("API Response:", res.data); // Print the response here

            // Assuming the API returns an array with a single object.
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setLoanDetails(res.data);  // Set the loan details to the first element of the array.
                // console.log(res.data);
            } else {
                setLoanDetails([]);  // Handle the case where the API returns an empty array or invalid data.
            }
            setSelectedUserId(userId);
        } catch (error) {
            console.error("Failed to fetch loan details:", error);
            setLoanDetails(null);
            setSelectedUserId(null);
        }
    };

    const handleDeleteAgent = async (agentId) => {
        if (!window.confirm("Are you sure you want to delete this agent?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents/${agentId}`);
            fetchUsers('agent-customer'); // Refresh agent list
        } catch (error) {
            console.error("Failed to delete agent:", error);
        }
    };

    const handleDeleteCustomer = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/users/${userId}`);
            fetchUsers('our-customer', startDate, endDate, currentPage, pageSize); // Refresh
        } catch (error) {
            console.error("Failed to delete customer:", error);
            alert("Error deleting customer.");
        }
    };
    // loan status
    const handleCheckLoanStatus = async (applicationId, refCode) => {
        if (!applicationId || !refCode) {
            alert("Missing Application ID or Ref Code.");
            return;
        }

        try {
            // const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/loan/check-loan-status`, {
            //     loan_application_id: applicationId,
            //     ref_code: refCode,
            // });

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/loan/check-loan-status`, {
                loan_application_id: applicationId,
                ref_code: refCode,
            }, {
                headers: {
                    //'Content-Type': 'application/json',  // Ensure correct content type
                },
            });

            const status = res.data.data.status || "No status found.";
            alert(`Loan Status: ${status}`);
        } catch (err) {
            console.error("Failed to fetch loan status:", err.response?.data || err.message);
            alert("Error fetching loan status.");
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Date Filter */}
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

            {/* Buttons */}
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-center gap-4">
                {['our-customer', 'agent-customer', 'today-customer'].map((type) => (
                    <button
                        key={type}
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded ${activeButton === type ? 'opacity-100' : 'opacity-70'}`}
                        onClick={() => handleButtonClick(type)}
                        disabled={isLoading}
                    >
                        {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Loading & Errors */}
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
                            <th className="px-6 py-3 text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center px-6 py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            visibleUsers.map((user, index) => (
                                <React.Fragment key={user._id || index}>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{user.name || user.fullName || '—'}</td>
                                        <td className="px-6 py-4">{user.email || '—'}</td>
                                        <td className="px-6 py-4">{getMobile(user)}</td>
                                        <td className="px-6 py-4">{user.createdAt ? formatDate(user.createdAt) : '—'}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                                onClick={() => fetchLoanDetails(user._id, user.userType || activeButton)}
                                            >
                                                Loan Details
                                            </button>

                                            {(activeButton === 'agent-customer' || activeButton === 'our-customer' || activeButton === 'today-customer') && (
                                                <button
                                                    className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                                    onClick={() => {
                                                        // For today-customer, decide the delete type by userType or available fields
                                                        if (activeButton === 'today-customer') {
                                                            if (user.userType === 'agent' || user.companyName) {
                                                                handleDeleteAgent(user._id);
                                                            } else {
                                                                handleDeleteCustomer(user._id);
                                                            }
                                                        } else if (activeButton === 'agent-customer') {
                                                            handleDeleteAgent(user._id);
                                                        } else {
                                                            handleDeleteCustomer(user._id);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                    {selectedUserId === user._id && Array.isArray(loanDetails) && loanDetails.length > 0 && (
                                        loanDetails.map((loan, idx) => (
                                            <tr key={idx} className="bg-gray-50 border-t">
                                                <td colSpan="5" className="px-6 py-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700">
                                                        <div><span className="font-semibold">Customer Name:</span> {loan.name || '—'}</div>
                                                        <div><span className="font-semibold">Application ID:</span> {loan.application_id || '—'}</div>
                                                        <div><span className="font-semibold">City:</span> {loan.city || '—'}</div>
                                                        <div><span className="font-semibold">PAN:</span> {loan.pan || '—'}</div>
                                                        <div><span className="font-semibold">Monthly Income:</span> ₹{loan.monthly_income || '—'}</div>
                                                        <div><span className="font-semibold">Loan Amount:</span> ₹{loan.loan_amount || '—'}</div>
                                                        <div><span className="font-semibold">Aadhaar:</span> {loan.aadhaar || '—'}</div>
                                                        <div><span className="font-semibold">Loan Type ID:</span> {loan.loan_type_id || '—'}</div>
                                                        <div><span className="font-semibold">Pin code:</span> {loan.pincode || '—'}</div>
                                                        <div><span className="font-semibold">ref code:</span> {loan.ref_code || '—'}</div>


                                                        <button
                                                            onClick={() => handleCheckLoanStatus(loan.application_id, loan.ref_code)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
                                                        >
                                                            Check Loan Status
                                                        </button>


                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {activeButton === 'our-customer' && totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 gap-1 flex-wrap">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`py-2 px-4 font-bold ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
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
            )}
        </div>
    );
};

export default UsersContent;