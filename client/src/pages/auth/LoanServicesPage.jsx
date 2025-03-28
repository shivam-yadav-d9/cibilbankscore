import React, { useState } from 'react';
import { 
  CreditCard, 
  Calculator, 
  DollarSign, 
  Home, 
  Percent, 
  FileText, 
  CheckCircle 
} from 'lucide-react';

const LoanServicesPage = () => {
  const [activeService, setActiveService] = useState('personal');

  const loanServices = {
    personal: {
      title: 'Personal Loans',
      description: 'Flexible personal loans tailored to your financial needs.',
      details: {
        minAmount: '$1,000',
        maxAmount: '$50,000',
        interestRate: '6.99% - 23.99%',
        termLength: '12 - 60 months'
      },
      requirements: [
        'Minimum credit score of 650',
        'Stable income verification',
        'Debt-to-income ratio under 40%',
        'Valid government ID'
      ]
    },
    mortgage: {
      title: 'Mortgage Loans',
      description: 'Comprehensive home financing solutions for your dream property.',
      details: {
        minAmount: '$50,000',
        maxAmount: '$5,000,000',
        interestRate: '3.5% - 6.5%',
        termLength: '15 - 30 years'
      },
      requirements: [
        'Minimum credit score of 720',
        'Down payment of 3% - 20%',
        'Stable employment history',
        'Comprehensive financial documentation'
      ]
    },
    business: {
      title: 'Business Loans',
      description: 'Empowering entrepreneurs with flexible business financing.',
      details: {
        minAmount: '$10,000',
        maxAmount: '$500,000',
        interestRate: '7.5% - 25%',
        termLength: '6 - 84 months'
      },
      requirements: [
        'Business operating for 2+ years',
        'Annual revenue over $100,000',
        'Detailed business plan',
        'Collateral or personal guarantee'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-11">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Loan Type Navigation */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Loan Services</h2>
          <div className="space-y-2">
            {Object.keys(loanServices).map((key) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`
                  w-full flex items-center p-3 rounded-md transition-all 
                  ${activeService === key 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-blue-100 text-gray-700'}
                `}
              >
                {key === 'personal' && <CreditCard className="mr-3" />}
                {key === 'mortgage' && <Home className="mr-3" />}
                {key === 'business' && <DollarSign className="mr-3" />}
                {loanServices[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Loan Details Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {loanServices[activeService].title}
              </h1>
              <p className="text-gray-600 mt-2">
                {loanServices[activeService].description}
              </p>
            </div>
            {activeService === 'personal' && <CreditCard size={48} className="text-blue-500" />}
            {activeService === 'mortgage' && <Home size={48} className="text-green-500" />}
            {activeService === 'business' && <DollarSign size={48} className="text-purple-500" />}
          </div>

          {/* Loan Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Loan Specifics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Loan Specifics</h3>
              <div className="space-y-3">
                {Object.entries(loanServices[activeService].details).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2 last:border-b-0">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Requirements */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Requirements</h3>
              <ul className="space-y-3">
                {loanServices[activeService].requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-3 text-blue-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Apply Section */}
          <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <div className="flex items-center mb-4">
              <FileText className="mr-3 text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">
                Quick Application Process
              </h3>
            </div>
            <p className="text-gray-600">
              Start your loan application online in minutes. Our streamlined process 
              ensures quick evaluation and competitive rates.
            </p>
            <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
              Start Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanServicesPage;