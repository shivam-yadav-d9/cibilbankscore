import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AccountSettings from "./AccountSettings";
import SubscriptionBilling from "./SubscriptionBilling";
import ServiceCatalogs from "./ServiceCatalogs";

const Dashboard = ({ updateAuth }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchUserData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!dashboardData || !userData) {
      navigate("/loan-information");
      return;
    }

    setUser({
      name: userData.name,
      email: userData.email,
      creditScore: dashboardData.creditScore,
      subscribedPlan: "Premium",
      subscriptionDate: "January 15, 2025",
      nextBillingDate: "February 15, 2025",
      phoneNumber: dashboardData.mobile || "+91 9876543210",
      pan: dashboardData.pan,
      dob: dashboardData.dob,
      loanInfo: dashboardData.loanInfo,
    });
  };

  useEffect(() => {
    fetchUserData();

    // Listen for changes in localStorage (for new signup)
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");  // Clear user data
    localStorage.removeItem("dashboardData"); // Clear dashboard data
    updateAuth();
    navigate("/login");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <Header user={user} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="mb-10 border-b border-slate-700/30 backdrop-blur-sm bg-slate-800/20 rounded-xl p-1">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium cursor-pointer text-sm transition-all duration-300 rounded-lg ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`px-6 py-3 font-medium cursor-pointer text-sm transition-all duration-300 rounded-lg ${
                activeTab === "account"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Profile Update
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`px-6 py-3 font-medium cursor-pointer text-sm transition-all duration-300 rounded-lg ${
                activeTab === "billing"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Subscription & Billing
            </button>
            <button
              onClick={() => setActiveTab("service")}
              className={`px-6 py-3 font-medium cursor-pointer text-sm transition-all duration-300 rounded-lg ${
                activeTab === "service"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Service Catalogs
            </button>
          </div>
        </div>

        {activeTab === "overview" && <Overview user={user} />}
        {activeTab === "account" && <AccountSettings user={user} />}
        {activeTab === "billing" && <SubscriptionBilling user={user} />}
        {activeTab === "service" && <ServiceCatalogs user={user} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Overview = ({ user }) => {
  // Determine credit score color
  const getCreditScoreColor = (score) => {
    if (score === 0) return "text-slate-400";
    if (score < 600) return "text-red-400";
    if (score < 700) return "text-amber-400";
    return "text-emerald-400";
  };

  // Get credit score description
  const getCreditScoreDescription = (score) => {
    if (score === 0) return "No Credit History";
    if (score < 600) return "Poor";
    if (score < 650) return "Average";
    if (score < 750) return "Very Good";
    return "Excellent";
  };

  // Get credit score icon
  const getCreditScoreIcon = (score) => {
    if (score === 0) {
      return "⚪";
    } else if (score < 600) {
      return "🔴";
    } else if (score < 650) {
      return "🟠";
    } else if (score < 750) {
      return "🟢";
    } else {
      return "✨";
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl shadow-2xl shadow-indigo-900/30 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
          <span className="mr-2">Welcome back,</span>
          <span className="bg-white/10 rounded-lg px-3 py-1 backdrop-blur-sm">
            {user.name}
          </span>
        </h1>
        <p className="text-indigo-200 text-lg">
          Here's an overview of your profile and credit health.
        </p>
      </div>

      {/* Credit Score Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-900/20 border border-slate-700/50 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-indigo-400"
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
            Credit Score
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="relative w-48 h-48 mx-auto md:mx-0 mb-6 md:mb-0">
              <div className="w-full h-full rounded-full border-8 border-slate-700/50 absolute"></div>
              <div
                className="w-full h-full rounded-full border-8 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent absolute animate-pulse"
                style={{
                  transform: `rotate(${(user.creditScore / 900) * 360}deg)`,
                  transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span
                  className={`text-4xl font-bold ${getCreditScoreColor(
                    user.creditScore
                  )}`}
                >
                  {user.creditScore}
                </span>
                <span className="text-slate-400 text-sm">out of 900</span>
              </div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-3 bg-slate-800/70 p-3 rounded-lg backdrop-blur-sm border border-slate-700/30">
                <span className="text-3xl mr-3">
                  {getCreditScoreIcon(user.creditScore)}
                </span>
                <span
                  className={`text-2xl font-semibold ${getCreditScoreColor(
                    user.creditScore
                  )}`}
                >
                  {getCreditScoreDescription(user.creditScore)}
                </span>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm border border-slate-700/30">
                {user.creditScore === 0
                  ? "You have no credit history yet. Taking a loan and making regular payments can help establish your credit score."
                  : user.creditScore < 600
                  ? "Your credit score needs improvement. Focus on paying existing loans on time."
                  : user.creditScore < 650
                  ? "Your credit score is fair. Continue making regular payments to improve it."
                  : user.creditScore < 750
                  ? "You have a good credit score. Keep up with timely payments."
                  : "Excellent credit score! You're likely to get the best loan terms."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Summary */}
      

      {/* Credit Tips */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-900/20 border border-slate-700/50 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Tips to Improve Your Credit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Payment Timeliness
              </h3>
              <p className="text-slate-300">
                Make all loan payments on time to avoid penalties and maintain a
                good credit score.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Credit Utilization
              </h3>
              <p className="text-slate-300">
                Keep your credit utilization below 30% of your available credit
                limit.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Regular Monitoring
              </h3>
              <p className="text-slate-300">
                Check your credit report regularly for errors and dispute
                inaccurate information.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Credit Mix
              </h3>
              <p className="text-slate-300">
                Maintain a diverse mix of credit accounts to demonstrate your
                ability to manage different types of credit.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-indigo-900/30 text-indigo-400 font-medium rounded-lg hover:bg-indigo-600/20 transition-all duration-300 border border-indigo-700/30">
              View All Credit Tips
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-900/20 border border-slate-700/50 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Check Credit Score
              </h3>
            </button>
            <button className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Apply for Loan
              </h3>
            </button>
            <button className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Pay EMI
              </h3>
            </button>
            <button className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                Support
              </h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
