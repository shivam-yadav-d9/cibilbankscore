import React, { useState } from 'react';
import { Code, CreditCard, Database, Lock, Server, Zap } from 'lucide-react';

const BankingAPIPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Banking API Overview',
      content: 'A comprehensive RESTful API for modern banking integrations, providing secure and efficient financial services.'
    },
    endpoints: {
      title: 'Key Endpoints',
      endpoints: [
        { 
          name: 'Account Balance', 
          method: 'GET', 
          path: '/accounts/{accountId}/balance',
          description: 'Retrieve real-time account balance information'
        },
        { 
          name: 'Transaction History', 
          method: 'GET', 
          path: '/accounts/{accountId}/transactions',
          description: 'Fetch recent transaction details with filtering options'
        },
        { 
          name: 'Transfer Funds', 
          method: 'POST', 
          path: '/transfers',
          description: 'Initiate secure fund transfers between accounts'
        }
      ]
    },
    authentication: {
      title: 'Authentication',
      content: 'Secure OAuth 2.0 based authentication with JWT tokens and multi-factor verification.'
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 mt-11">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">API Navigation</h2>
          <nav>
            {Object.keys(sections).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left p-3 rounded-md mb-2 transition-colors ${
                  activeSection === key 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-blue-100 text-gray-700'
                }`}
              >
                {sections[key].title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
            {sections[activeSection].title}
          </h1>

          {activeSection === 'overview' && (
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {sections[activeSection].content}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                  <Server className="mr-4 text-blue-500" />
                  <span>RESTful Architecture</span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex items-center">
                  <Lock className="mr-4 text-green-500" />
                  <span>Bank-Grade Security</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'endpoints' && (
            <div className="space-y-4">
              {sections[activeSection].endpoints.map((endpoint, index) => (
                <div 
                  key={index} 
                  className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {endpoint.name}
                    </h3>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${endpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {endpoint.method}
                    </span>
                  </div>
                  <code className="block bg-gray-200 p-2 rounded mb-2 text-sm">
                    {endpoint.path}
                  </code>
                  <p className="text-gray-600">{endpoint.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'authentication' && (
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {sections[activeSection].content}
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <Lock className="mr-3 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Security Features
                  </h3>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>OAuth 2.0 protocol implementation</li>
                  <li>JSON Web Token (JWT) authentication</li>
                  <li>Multi-factor authentication support</li>
                  <li>Encrypted communication channels</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingAPIPage;