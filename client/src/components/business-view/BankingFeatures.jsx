import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// B2B Banking Features Component
const BankingFeatures = ({ business }) => {
  const [paymentData, setPaymentData] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [accountTiers, setAccountTiers] = useState({});
  const [insights, setInsights] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to fetch banking data
    setTimeout(() => {
      // Sample payment data
      setPaymentData([
        { month: "Jan", automated: 42000, manual: 18000 },
        { month: "Feb", automated: 48000, manual: 15000 },
        { month: "Mar", automated: 53000, manual: 12000 },
      ]);

      // Sample security alerts
      setSecurityAlerts([
        {
          id: 1,
          type: "Suspicious Login",
          severity: "medium",
          timestamp: "Mar 29, 2025 08:42 AM",
          status: "resolved",
        },
        {
          id: 2,
          type: "Unusual Transaction Pattern",
          severity: "high",
          timestamp: "Mar 30, 2025 02:15 PM",
          status: "investigating",
        },
        {
          id: 3,
          type: "Multiple Failed Attempts",
          severity: "low",
          timestamp: "Mar 31, 2025 11:23 AM",
          status: "resolved",
        },
      ]);

      // Account tier details
      setAccountTiers({
        tier: "Enterprise",
        features: [
          { name: "Dedicated Account Manager", enabled: true },
          { name: "Bulk Transaction Processing", enabled: true },
          { name: "API Integration", enabled: true },
          { name: "Advanced Reporting", enabled: true },
          { name: "Multi-User Access Control", enabled: true },
          { name: "Payment Gateway Integration", enabled: false },
        ],
        limits: {
          dailyTransactionLimit: 500000,
          monthlyProcessingCap: 10000000,
          internationalPayments: true,
          batchSize: 1000,
        },
      });

      // Financial insights
      setInsights([
        {
          id: 1,
          title: "Cash Flow Optimization",
          description:
            "AI analysis suggests delaying non-essential payments could improve monthly cash reserve by 12%",
          impact: "high",
          actionable: true,
        },
        {
          id: 2,
          title: "Transaction Fee Reduction",
          description:
            "Consolidating payment batches could save approximately $2,450 in processing fees",
          impact: "medium",
          actionable: true,
        },
        {
          id: 3,
          title: "Budget Forecast",
          description:
            "Based on current spending patterns, Q2 expenses projected to increase by 8%",
          impact: "medium",
          actionable: false,
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const togglePaymentProcessing = () => {
    setPaymentProcessing(!paymentProcessing);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banking features header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          B2B Banking Tools
        </h1>
        <p className="text-slate-600 text-lg">
          Advanced financial tools for {business.name}
        </p>
      </div>

      {/* 1. Automated Payment Processing */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Automated Payment Processing
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Reduce transaction time and operational costs
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-slate-700">
              {paymentProcessing ? "Active" : "Paused"}
            </span>
            <button
              onClick={togglePaymentProcessing}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                paymentProcessing ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  paymentProcessing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Processing Status
              </span>
              <span className="text-sm font-medium text-emerald-600">
                Optimal
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="automated"
                  name="Automated Payments"
                  fill="#6366f1"
                />
                <Bar dataKey="manual" name="Manual Payments" fill="#cbd5e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-500">
                Processing Speed
              </p>
              <p className="text-xl font-bold text-slate-900">1.2s avg</p>
              <p className="text-xs text-emerald-600 mt-1">
                ↓ 0.3s from last month
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-500">Success Rate</p>
              <p className="text-xl font-bold text-slate-900">99.8%</p>
              <p className="text-xs text-emerald-600 mt-1">
                ↑ 0.2% from last month
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-500">Cost Savings</p>
              <p className="text-xl font-bold text-slate-900">$4,280</p>
              <p className="text-xs text-emerald-600 mt-1">
                ↑ $820 from last month
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            Configure payment settings
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

      {/* 2. Multi-Tier Security Measures */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Multi-Tier Security Measures
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI-driven fraud detection and data protection
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-900">
                  Fraud Detection
                </p>
                <p className="text-xs text-slate-500">
                  AI model accuracy: 98.7%
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-900">Encryption</p>
                <p className="text-xs text-slate-500">
                  256-bit AES, end-to-end
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-900">
                  Access Control
                </p>
                <p className="text-xs text-slate-500">
                  Role-based, MFA enabled
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-700">
                Recent Security Alerts
              </p>
            </div>
            <div className="divide-y divide-slate-200">
              {securityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        alert.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : alert.severity === "medium"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900">
                        {alert.type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {alert.status.charAt(0).toUpperCase() +
                      alert.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View all security logs
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

      {/* 3. Scalable Business Accounts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Scalable Business Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Custom financial structure for your business needs
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {accountTiers.tier.charAt(0)}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Current Tier</p>
              <p className="text-2xl font-bold text-slate-900">
                {accountTiers.tier}
              </p>
            </div>
            <div className="ml-auto">
              <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-300 text-sm font-medium">
                Upgrade Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Tier Features
              </p>
              <ul className="space-y-2">
                {accountTiers.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    {feature.enabled ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-slate-300 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Account Limits
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      Daily Transaction Limit
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      $
                      {accountTiers.limits.dailyTransactionLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      Monthly Processing Cap
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      $
                      {accountTiers.limits.monthlyProcessingCap.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: "42%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      Batch Size
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {accountTiers.limits.batchSize.toLocaleString()}{" "}
                      transactions
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                International Payments Enabled
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View account details
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

      {/* 4. Financial Insights */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Financial Insights
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered analysis and recommendations
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-lg p-4 ${
                  insight.impact === "high"
                    ? "border-emerald-200 bg-emerald-50"
                    : insight.impact === "medium"
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      insight.impact === "high"
                        ? "bg-emerald-100 text-emerald-600"
                        : insight.impact === "medium"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
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
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-900">
                        {insight.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === "high"
                            ? "bg-emerald-100 text-emerald-800"
                            : insight.impact === "medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {insight.impact.charAt(0).toUpperCase() +
                          insight.impact.slice(1)}{" "}
                        Impact
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View all insights
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

      {/* Action buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-300 text-sm font-medium">
          Export Data
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium">
          Schedule Meeting
        </button>
      </div>
    </div>
  );
};

export default BankingFeatures;
