import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  BarChart2, 
  Clock 
} from 'lucide-react';

const InvestmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample investment data
  const portfolioSummary = {
    totalValue: 1245670,
    dailyChange: 3245,
    percentageChange: 1.2,
    assetAllocation: [
      { name: 'Stocks', value: 65, color: 'bg-blue-500' },
      { name: 'Bonds', value: 25, color: 'bg-green-500' },
      { name: 'Real Estate', value: 10, color: 'bg-purple-500' }
    ]
  };

  const recentTransactions = [
    { id: 1, type: 'Buy', asset: 'Apple Inc.', amount: 5200, date: '2024-03-15' },
    { id: 2, type: 'Sell', asset: 'Microsoft Corp.', amount: 7500, date: '2024-03-10' },
    { id: 3, type: 'Dividend', asset: 'S&P 500 ETF', amount: 1200, date: '2024-03-05' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Wealth Management Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-md transition ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition ${
                activeTab === 'portfolio' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Portfolio Value */}
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Wallet className="mr-2 text-blue-600" />
                Total Portfolio Value
              </h2>
              <div className={`flex items-center ${
                portfolioSummary.dailyChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioSummary.dailyChange > 0 ? <TrendingUp /> : <TrendingDown />}
                <span className="ml-2">
                  ${portfolioSummary.dailyChange.toLocaleString()} 
                  ({portfolioSummary.percentageChange}%)
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${portfolioSummary.totalValue.toLocaleString()}
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <PieChart className="mr-2 text-blue-600" />
              Asset Allocation
            </h2>
            <div className="space-y-3">
              {portfolioSummary.assetAllocation.map((asset) => (
                <div key={asset.name} className="flex items-center">
                  <div className={`w-4 h-4 mr-3 rounded-full ${asset.color}`}></div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span>{asset.name}</span>
                      <span>{asset.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <Clock className="mr-2 text-blue-600" />
              Recent Transactions
            </h2>
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{transaction.type} - {transaction.asset}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'Buy' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ${transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;