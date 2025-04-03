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
    <>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-12 gap-5 flex-col-reverse md:flex-row text-center md:text-left mt-16">
        <div className="left">
          <h1 className="text-4xl text-crimson md:text-5xl">
            The Modern banking <span className="font-bold text-blue-500">solutions</span> <br />
            For your business in one app
          </h1>
          <p className="text-gray-600 text-base md:text-lg my-4">
            At DBNpe, we believe everyone deserves financial freedom, whether you’re looking to check your CIBIL score or secure a loan—our platform makes it simple to understand your credit health and achieve your goals.
          </p>
          <button className="text-white bg-crimson py-2 px-4 text-base md:text-lg rounded hover:bg-red-700 transition">
            Get Start
          </button>
        </div>
        <div className="right mt-5 md:mt-0">
          <img src="/auth.png" alt="Hero Image" className="max-w-full" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-900/20 backdrop-blur-sm xl:w-[1200px] mx-auto mb-7">
        <div className="p-8 xl:p-10">
          <h2 className="text-[30px] font-semibold text-black mb-12 flex items-center justify-center text-center">
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
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
            <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
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
              <Link to="/userinput"> <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Check Credit Score
              </h3>
              </Link>
            </button>

            <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2a6 6 0 016 6c0 3-6 10-6 10S6 11 6 8a6 6 0 016-6zm1 9h-2v2h2v-2zm0-4h-2v3h2V7z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Apply For Loan
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
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
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
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
              IMPS (Immediate Payment Service)

              </h3>
            </button> */}

          </div>
        </div>
      </div>


    </>
  );
};

export default Dashboard;


