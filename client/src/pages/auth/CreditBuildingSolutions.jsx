import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Star, 
  Book, 
  Activity 
} from 'lucide-react';

const CreditBuildingSolutions = () => {
  const [activeService, setActiveService] = useState('creditCard');

  const creditServices = {
    creditCard: {
      title: 'Secured Credit Card',
      description: 'A foundational tool for establishing and improving credit history.',
      features: [
        'Low initial credit limit',
        'Secured by cash deposit',
        'Reports to all major credit bureaus',
        'No credit history required'
      ],
      benefits: [
        'Build credit from scratch',
        'Controlled spending limits',
        'Lower approval requirements',
        'Gradual credit limit increases'
      ],
      details: {
        depositRange: '$200 - $2,500',
        annualFee: '$0 - $49',
        interestRate: '18% - 25%',
        reportingFrequency: 'Monthly'
      }
    },
    creditBuilder: {
      title: 'Credit Builder Loan',
      description: 'Designed to help establish credit through controlled savings.',
      features: [
        'Fixed monthly payments',
        'Funds held in secured account',
        'Reported to credit bureaus',
        'Builds savings simultaneously'
      ],
      benefits: [
        'Improve credit score',
        'Create emergency savings',
        'Low-risk credit building',
        'Predictable payment structure'
      ],
      details: {
        loanAmount: '$500 - $3,000',
        termLength: '12 - 24 months',
        interestRate: '6% - 12%',
        setupFee: '$25 - $50'
      }
    },
    creditEducation: {
      title: 'Credit Education Program',
      description: 'Comprehensive financial literacy and credit management resources.',
      features: [
        'Personal credit coaching',
        'Online learning modules',
        'Credit score simulation',
        'Personalized improvement strategies'
      ],
      benefits: [
        'Understand credit mechanics',
        'Learn financial management',
        'Develop long-term credit strategies',
        'Free ongoing support'
      ],
      details: {
        programDuration: '3 - 6 months',
        sessionFrequency: 'Weekly',
        supportLevel: 'Comprehensive',
        costStructure: 'Included with other services'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-11">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service Navigation */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Credit Solutions</h2>
          <div className="space-y-2">
            {Object.keys(creditServices).map((key) => (
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
                {key === 'creditCard' && <CreditCard className="mr-3" />}
                {key === 'creditBuilder' && <Activity className="mr-3" />}
                {key === 'creditEducation' && <Book className="mr-3" />}
                {creditServices[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Service Details Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {creditServices[activeService].title}
              </h1>
              <p className="text-gray-600 mt-2">
                {creditServices[activeService].description}
              </p>
            </div>
            {activeService === 'creditCard' && <CreditCard size={48} className="text-blue-500" />}
            {activeService === 'creditBuilder' && <Activity size={48} className="text-green-500" />}
            {activeService === 'creditEducation' && <Book size={48} className="text-purple-500" />}
          </div>

          {/* Service Features and Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Features</h3>
              <ul className="space-y-3">
                {creditServices[activeService].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Star className="mr-3 text-yellow-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Benefits</h3>
              <ul className="space-y-3">
                {creditServices[activeService].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <TrendingUp className="mr-3 text-blue-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service Details */}
          <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <ShieldCheck className="mr-3 text-green-600" size={24} />
                Service Details
              </h3>
              {Object.entries(creditServices[activeService].details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2 last:border-b-0">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Ready to Build Your Credit?
              </h3>
              <p className="text-gray-600 mt-2">
                Start your journey to financial empowerment today.
              </p>
            </div>
            <button className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditBuildingSolutions;