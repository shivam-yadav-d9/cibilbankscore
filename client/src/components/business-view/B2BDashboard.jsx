import React, { useState, useEffect } from "react";
import BankingFeatures from "./BankingFeatures";
import CreditOverview from "./CreditOverview";
import {  useNavigate } from "react-router-dom";
// import UserScores from "./UserScores";

const B2BDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState("features");
  const navigate = useNavigate();

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
    navigate("/login")
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
              onClick={() => setActiveTab("features")}
              className={`pb-4 font-medium cursor-pointer text-sm transition-all duration-200 ${
                activeTab === "features"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Banking Features
            </button>

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
            
            {/* <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 font-medium cursor-pointer text-sm transition-all duration-200 ${
                activeTab === "users"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              User Scores
            </button> */}
          </div>
        </div>

        {activeTab === "features" && <BankingFeatures business={business} />}
        {activeTab === "overview" && <CreditOverview business={business} />}
        {/* {activeTab === "users" && <UserScores business={business} />} */}
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

export default B2BDashboard;
