import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  BarChart2,
  FileText,
  Shield,
  Landmark,
  Phone,
  Users,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 mt-8">
      {/* Featured Services - Four cards with hover effects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <h2 className="text-2xl font-bold text-center mb-12 flex items-center justify-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-1 rounded ">
            Featured
          </span>
          <span>Services</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Credit Score Check */}
          <Link to="/credit-check" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <CreditCard
                  className="text-blue-600 group-hover:text-white transition-colors duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Credit Score Check
              </h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">
                Monitor your credit health and get personalized insights on
                improving your score.
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>Check Now</span>
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:ml-2 transition-all duration-300"
                />
              </div>
            </div>
          </Link>

          {/* Apply for Loan */}
          <Link to="/UserLoanpage" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors duration-300">
                <Landmark
                  className="text-indigo-600 group-hover:text-white transition-colors duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                Apply for Loan
              </h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">
                Fast approval process with competitive interest rates and
                flexible repayment options.
              </p>
              <div className="flex items-center text-indigo-600 font-medium text-sm">
                <span>Apply Now</span>
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:ml-2 transition-all duration-300"
                />
              </div>
            </div>
          </Link>

          {/* Expert Connect - Replacing Financial Analytics */}
          <Link to="/expert-connect" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors duration-300">
                <Users
                  className="text-purple-600 group-hover:text-white transition-colors duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">
                Expert Connect
              </h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">
                Connect with financial advisors and experts for personalized
                guidance and solutions.
              </p>
              <div className="flex items-center text-purple-600 font-medium text-sm">
                <span>Connect Now</span>
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:ml-2 transition-all duration-300"
                />
              </div>
            </div>
          </Link>

          {/* Legal Advice */}
          <Link to="/CustomerLegalAdvice" className="group">
            <div className="bg-white h-full rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] border border-slate-100 flex flex-col">
              <div className="h-12 w-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors duration-300">
                <FileText
                  className="text-teal-600 group-hover:text-white transition-colors duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-teal-600 transition-colors duration-300">
                Legal Advice
              </h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">
                Get professional help for customer rights, legal queries, and contract advice.
              </p>
              <div className="flex items-center text-teal-600 font-medium text-sm">
                <span>Get Help</span>
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:ml-2 transition-all duration-300"
                />
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
                <br />
                Solution for your business
              </h1>
              <p className="mt-6 text-slate-600 text-lg max-w-lg">
                Unlock financial freedom with DBNpe - seamlessly manage your
                credit health, secure loans, and achieve your financial goals
                all in one place.
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
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services Section with Elegant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              All Services
            </span>
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
              <span className="font-medium text-sm"> Bill Payment</span>
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
