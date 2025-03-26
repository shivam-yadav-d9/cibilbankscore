import React, { useState, useEffect } from "react";

const B2BDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate API call to fetch business data
    setTimeout(() => {
      setBusiness({
        name: "Acme Financial Services",
        email: "admin@acmefinancial.com",
        industry: "Financial Services",
        plan: "Enterprise",
        subscriptionDate: "January 10, 2025",
        nextBillingDate: "April 10, 2025",
        totalUsers: 128,
        activeUsers: 115,
        // Credit score specific data
        creditMetrics: {
          averageScore: 742,
          highRiskUsers: 15,
          mediumRiskUsers: 42,
          lowRiskUsers: 71,
          pendingReviews: 8,
          lastUpdated: "March 12, 2025",
        },
        // Sample users with credit scores
        users: [
          {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            score: 810,
            lastChecked: "Mar 10, 2025",
            status: "Excellent",
            trend: "up",
          },
          {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            score: 745,
            lastChecked: "Mar 11, 2025",
            status: "Good",
            trend: "stable",
          },
          {
            id: 3,
            name: "Michael Brown",
            email: "michael@example.com",
            score: 680,
            lastChecked: "Mar 09, 2025",
            status: "Fair",
            trend: "up",
          },
          {
            id: 4,
            name: "Lisa Wong",
            email: "lisa@example.com",
            score: 590,
            lastChecked: "Mar 12, 2025",
            status: "Poor",
            trend: "down",
          },
          {
            id: 5,
            name: "Robert Chen",
            email: "robert@example.com",
            score: 820,
            lastChecked: "Mar 10, 2025",
            status: "Excellent",
            trend: "stable",
          },
        ],
        // Services offered
        services: [
          {
            id: 1,
            name: "Basic Credit Monitoring",
            status: "active",
            usage: 92,
          },
          { id: 2, name: "Credit Score Alerts", status: "active", usage: 78 },
          {
            id: 3,
            name: "Detailed Credit Reports",
            status: "active",
            usage: 65,
          },
          {
            id: 4,
            name: "Credit Improvement Tools",
            status: "inactive",
            usage: 0,
          },
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    console.log("Logged out");
    // Navigate to login page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex space-x-2">
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-md">
                  <span className="text-lg font-extrabold text-white">CS</span>
                </div>
              </div>
              <div className="ml-4 text-xl font-bold text-slate-800">
                Credit Score Portal
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {business.name}
                </p>
                <p className="text-xs text-slate-500">{business.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {business.name.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="mb-10 border-b border-slate-200">
          <div className="flex space-x-12">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 font-medium cursor-pointer text-sm transition-all duration-200 ${
                activeTab === "overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Credit Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 font-medium cursor-pointer text-sm transition-all duration-200 ${
                activeTab === "users"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              User Scores
            </button>
          </div>
        </div>

        {activeTab === "overview" && <CreditOverview business={business} />}
        {activeTab === "users" && <UserScores business={business} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-xs font-extrabold text-white">CS</span>
              </div>
              <span className="ml-1 text-sm font-medium text-slate-800">
                Credit Score Portal
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-slate-500">
                &copy; 2025 Credit Score Services. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                API Documentation
              </a>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Credit Overview Tab
const CreditOverview = ({ business }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {business.name}
        </h1>
        <p className="text-slate-600 text-lg">
          Here's an overview of your users' credit scores and metrics.
        </p>
      </div>

      {/* Credit Score Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">
                Average Score
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {business.creditMetrics.averageScore}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Last updated: {business.creditMetrics.lastUpdated}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">
                High Risk Users
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {business.creditMetrics.highRiskUsers}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {Math.round(
                (business.creditMetrics.highRiskUsers / business.totalUsers) *
                  100
              )}
              % of total users
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Medium Risk</p>
              <p className="text-2xl font-bold text-slate-900">
                {business.creditMetrics.mediumRiskUsers}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {Math.round(
                (business.creditMetrics.mediumRiskUsers / business.totalUsers) *
                  100
              )}
              % of total users
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Low Risk</p>
              <p className="text-2xl font-bold text-slate-900">
                {business.creditMetrics.lowRiskUsers}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {Math.round(
                (business.creditMetrics.lowRiskUsers / business.totalUsers) *
                  100
              )}
              % of total users
            </p>
          </div>
        </div>
      </div>

      {/* Credit Score Distribution */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Credit Score Distribution
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your users' credit scores
          </p>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end space-x-6 px-2">
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-red-400 rounded-t-lg"
                style={{
                  height: `${
                    (business.creditMetrics.highRiskUsers /
                      business.totalUsers) *
                    200
                  }px`,
                }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">300-549</p>
              <p className="text-xs text-slate-500">Poor</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-red-300 rounded-t-lg"
                style={{ height: "40px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">550-599</p>
              <p className="text-xs text-slate-500">Poor</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-amber-300 rounded-t-lg"
                style={{ height: "70px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">600-649</p>
              <p className="text-xs text-slate-500">Fair</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-amber-200 rounded-t-lg"
                style={{ height: "90px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">650-699</p>
              <p className="text-xs text-slate-500">Fair</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-200 rounded-t-lg"
                style={{ height: "120px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">700-749</p>
              <p className="text-xs text-slate-500">Good</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-300 rounded-t-lg"
                style={{ height: "100px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">750-799</p>
              <p className="text-xs text-slate-500">Very Good</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-emerald-400 rounded-t-lg"
                style={{ height: "80px" }}
              ></div>
              <p className="mt-2 text-xs font-medium text-slate-600">800-850</p>
              <p className="text-xs text-slate-500">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Credit Score Changes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Credit Score Changes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Most recent changes in user credit scores
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Current Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {business.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {user.score}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center text-sm font-medium ${
                        user.trend === "up"
                          ? "text-emerald-600"
                          : user.trend === "down"
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {user.trend === "up" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {user.trend === "down" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {user.trend === "stable" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {user.trend.charAt(0).toUpperCase() + user.trend.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Excellent" || user.status === "Good"
                          ? "bg-emerald-100 text-emerald-800"
                          : user.status === "Fair"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.lastChecked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View all users
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// User Scores Tab (simplified version)
const UserScores = ({ business }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = business.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          User Credit Scores
        </h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Checked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default B2BDashboard;
