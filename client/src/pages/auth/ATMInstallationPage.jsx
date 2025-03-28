import React, { useState } from 'react';
import { 
  MapPin, 
  Monitor, 
  Settings, 
  Shield, 
  Truck, 
  DollarSign, 
  Check,
  Lock 
} from 'lucide-react';

const ATMInstallationPage = () => {
  const [activeService, setActiveService] = useState('siteSelection');

  const atmServices = {
    siteSelection: {
      title: 'Site Selection & Analysis',
      description: 'Strategic location assessment for optimal ATM placement.',
      features: [
        'Comprehensive foot traffic analysis',
        'Demographic market research',
        'Competitive landscape evaluation',
        'Accessibility and visibility assessment'
      ],
      benefits: [
        'Maximize transaction volume',
        'Optimize revenue potential',
        'Minimize operational risks',
        'Targeted location strategy'
      ],
      details: {
        analysisTime: '2-3 weeks',
        reportDelivery: 'Comprehensive PDF',
        costEstimate: '$1,500 - $3,000',
        includesOnSiteVisit: 'Yes'
      }
    },
    machineSelection: {
      title: 'ATM Machine Selection',
      description: 'Tailored ATM hardware solutions for your specific needs.',
      features: [
        'Multiple machine models',
        'Customizable configurations',
        'Latest security technologies',
        'Multi-currency support'
      ],
      benefits: [
        'Advanced security features',
        'User-friendly interfaces',
        'Energy-efficient designs',
        'Scalable technology'
      ],
      details: {
        machineTypes: '5+ models',
        warrantyPeriod: '3-5 years',
        softwareUpdates: 'Included',
        installationSupport: 'Comprehensive'
      }
    },
    installationSupport: {
      title: 'Installation & Technical Support',
      description: 'End-to-end ATM deployment and ongoing technical assistance.',
      features: [
        'Professional installation',
        'Network configuration',
        'Security system integration',
        '24/7 technical support'
      ],
      benefits: [
        'Minimal downtime',
        'Expert technical guidance',
        'Compliance assurance',
        'Continuous monitoring'
      ],
      details: {
        installationTime: '1-2 days',
        supportCoverage: '24/7/365',
        responseTime: '30 minutes',
        remoteManagement: 'Included'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-11">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service Navigation */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">ATM Services</h2>
          <div className="space-y-2">
            {Object.keys(atmServices).map((key) => (
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
                {key === 'siteSelection' && <MapPin className="mr-3" />}
                {key === 'machineSelection' && <Monitor className="mr-3" />}
                {key === 'installationSupport' && <Settings className="mr-3" />}
                {atmServices[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Service Details Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {atmServices[activeService].title}
              </h1>
              <p className="text-gray-600 mt-2">
                {atmServices[activeService].description}
              </p>
            </div>
            {activeService === 'siteSelection' && <MapPin size={48} className="text-blue-500" />}
            {activeService === 'machineSelection' && <Monitor size={48} className="text-green-500" />}
            {activeService === 'installationSupport' && <Settings size={48} className="text-purple-500" />}
          </div>

          {/* Service Features and Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Features</h3>
              <ul className="space-y-3">
                {atmServices[activeService].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-3 text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Benefits</h3>
              <ul className="space-y-3">
                {atmServices[activeService].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <DollarSign className="mr-3 text-blue-500 flex-shrink-0" size={20} />
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
                <Shield className="mr-3 text-green-600" size={24} />
                Service Details
              </h3>
              {Object.entries(atmServices[activeService].details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2 last:border-b-0">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security and Compliance Section */}
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Lock className="mr-3 text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">
                Security and Compliance
              </h3>
            </div>
            <p className="text-gray-600">
              Our ATM installation services adhere to the highest industry standards, 
              ensuring robust security, regulatory compliance, and optimal performance.
            </p>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Shield className="text-green-500 mb-2" size={32} />
                <h4 className="font-semibold">Secure Deployment</h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Truck className="text-blue-500 mb-2" size={32} />
                <h4 className="font-semibold">End-to-End Support</h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Monitor className="text-purple-500 mb-2" size={32} />
                <h4 className="font-semibold">Continuous Monitoring</h4>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Ready to Deploy Your ATM?
              </h3>
              <p className="text-gray-600 mt-2">
                Contact our experts for a comprehensive ATM installation consultation.
              </p>
            </div>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATMInstallationPage;