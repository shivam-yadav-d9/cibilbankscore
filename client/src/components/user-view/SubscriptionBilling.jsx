import React from "react";
import {
  Download,
  CreditCard,
  Calendar,
  ChevronRight,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

const SubscriptionBilling = ({ user }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden">
      <div className="p-8">
        {/* Header with gradient accent */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-xl rounded-full"></div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Subscription & Billing
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-green-400">System Active</span>
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">
                  Current Plan:{" "}
                  <span className="text-indigo-400 font-bold">
                    {user.subscribedPlan}
                  </span>
                </h3>
                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-full border border-green-500/20 flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-400 mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                <p>
                  Started on:{" "}
                  <span className="text-slate-300">
                    {user.subscriptionDate}
                  </span>
                </p>
              </div>
              <div className="text-sm text-slate-400 mb-5">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />
                  Next billing date:{" "}
                  <span className="text-white font-medium ml-1">
                    {user.nextBillingDate}
                  </span>
                </p>
              </div>
            </div>

            {/* Subscription benefits summary */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/70 p-2 rounded-lg md:mr-4">
              <Star className="h-4 w-4 text-indigo-400" />
              <span>Premium benefits active</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/30 flex items-center group">
              Upgrade Plan
              <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="px-5 py-2.5 bg-slate-800/70 border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-all duration-300">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-1">Plan Cost</p>
            <p className="text-xl font-bold text-white">
              $29.99
              <span className="text-slate-400 text-sm font-normal">/mo</span>
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-1">Billing Cycle</p>
            <p className="text-xl font-bold text-white">Monthly</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-1">Payment Method</p>
            <p className="text-xl font-bold text-white">Visa ••••4242</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-1">Subscription Status</p>
            <p className="text-xl font-bold text-green-400">Active</p>
          </div>
        </div>

        {/* Billing History */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Billing History</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      Feb 01, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">
                      $29.99
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/20 flex items-center gap-1.5 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center group">
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      Jan 01, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">
                      $29.99
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/20 flex items-center gap-1.5 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      Dec 01, 2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">
                      $29.99
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/20 flex items-center gap-1.5 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Support section */}
          <div className="mt-8 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-5 border border-indigo-700/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-white font-medium mb-1">
                Need help with your subscription?
              </h4>
              <p className="text-slate-300 text-sm">
                Our support team is available 24/7 to assist you with any
                questions
              </p>
            </div>
            <button className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium rounded-xl hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBilling;
