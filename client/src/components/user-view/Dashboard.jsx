import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, BarChart2, FileText, Shield, Landmark, Phone, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 mt-8">
      {/* Featured Services - Four cards with hover effects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <h2 className="text-2xl font-bold text-center mb-12 flex items-center justify-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-1 rounded ">Featured</span>
          <span>Services</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Credit Score Check */}
          <Link to="/credit-check" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <CreditCard className="text-blue-600 group-hover:text-white transition-colors duration-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">Credit Score Check</h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">Monitor your credit health and get personalized insights on improving your score.</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>Check Now</span>
                <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Apply for Loan */}
          <Link to="/UserLoanpage" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors duration-300">
                <Landmark className="text-indigo-600 group-hover:text-white transition-colors duration-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">Apply for Loan</h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">Fast approval process with competitive interest rates and flexible repayment options.</p>
              <div className="flex items-center text-indigo-600 font-medium text-sm">
                <span>Apply Now</span>
                <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Expert Connect - Replacing Financial Analytics */}
          <Link to="/expert-connect" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors duration-300">
                <Users className="text-purple-600 group-hover:text-white transition-colors duration-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">Expert Connect</h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">Connect with financial advisors and experts for personalized guidance and solutions.</p>
              <div className="flex items-center text-purple-600 font-medium text-sm">
                <span>Connect Now</span>
                <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Bill Payment */}
          <Link to="/bill-payment" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors duration-300">
                <FileText className="text-teal-600 group-hover:text-white transition-colors duration-300" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-teal-600 transition-colors duration-300">Bill Payment</h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">Pay all your bills in one place with automated reminders and payment tracking.</p>
              <div className="flex items-center text-teal-600 font-medium text-sm">
                <span>Pay Bills</span>
                <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Section with Glass Morphism */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  Modern Banking
                </span>
                <br />Solution for your business
              </h1>
              <p className="mt-6 text-slate-600 text-lg max-w-lg">
                Unlock financial freedom with DBNpe - seamlessly manage your credit health, secure loans, and achieve your financial goals all in one place.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white py-3 px-8 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button className="border border-slate-300 hover:border-slate-400 py-3 px-8 rounded-xl font-medium transition-all text-slate-700 hover:bg-slate-50">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 p-6 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl blur opacity-30"></div>
                <img 
                  src="/auth.png" 
                  alt="Banking Dashboard" 
                  className="relative rounded-2xl shadow-lg object-cover w-full max-w-md"
                />
              </div>
<<<<<<< HEAD
            </div>
=======
              <Link to="/UserLoanpage"> <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Apply For Loan
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
                    d="M9 2h6a2 2 0 012 2v16a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2zm0 4h6m-6 4h6m-6 4h4"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Bill Payment
              </h3>
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
                    d="M12 3v2m0 16v2m-6-6h12m-7-7H5l2.5 7h9L19 8h-4.5M12 3L8.5 10h7L12 3z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Legal Advice
              </h3>
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
                    d="M12 8c1.38 0 2.5-1.12 2.5-2.5S13.38 3 12 3 9.5 4.12 9.5 5.5 10.62 8 12 8zm0 0v4m0 4v5m0-5h5m-5 0H7m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Split EMI
              </h3>
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
                    d="M3 5l18 18M15 7h.01M6.6 5.4l1.4 1.4M17 17l4 4m-9.4-4.4l1.4 1.4m-9.4 0l-1.4 1.4M15 17h.01M6.6 18.6l1.4-1.4m0-10l-1.4-1.4M18.6 6.6l-1.4 1.4M12 12l-3 3m0-6l3 3m6 6l-3-3m0 6l3-3"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Stop Recovery Call
              </h3>
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
                    d="M12 2a10 10 0 00-10 10h1a9 9 0 0118 0h1a10 10 0 00-10-10zm-4 10a4 4 0 118 0m-8 0a4 4 0 118 0m-4 0v6m0 0h-2m2 0h2"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Expect Connect
              </h3>
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
                    d="M12 2C7.58 2 4 4.58 4 7.95V12c0 3.64 2.56 6.69 6.24 7.78a1 1 0 00.52 0C17.44 18.69 20 15.64 20 12V7.95C20 4.58 16.42 2 12 2zM10 12.5l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Insurance
              </h3>
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
              IMPS (Immediate Payment Service)

              </h3>
            </button> *

>>>>>>> 84b476f9e3791183b9278b520bf2c96fa397325a
          </div>
        </div>
      </div>

      {/* Additional Services Section with Elegant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">All Services</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Service Item 1 */}
            <div className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-sm">Insurance</span>
            </div>
            
            {/* Service Item 2 - Financial Analytics moved here */}
            <div className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                <BarChart2 className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="font-medium text-sm">Financial Analytics</span>
            </div>
            
            {/* Service Item 3 */}
            <div className="group p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-all">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium text-sm">Stop Recovery Call</span>
            </div>
            
            {/* Service Item 4 */}
            <div className="group p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-all duration-300 hover:shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-all">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <span className="font-medium text-sm">Legal Advice</span>
            </div>
            
            {/* Add the remaining service items with similar structure */}
            <div className="group p-4 rounded-xl border border-slate-200 hover:border-pink-300 transition-all duration-300 hover:shadow flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-all">
                <CreditCard className="h-5 w-5 text-pink-600" />
              </div>
              <span className="font-medium text-sm">Split EMI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;