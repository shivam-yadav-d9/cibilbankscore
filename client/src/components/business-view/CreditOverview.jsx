import React from "react";

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

export default CreditOverview;