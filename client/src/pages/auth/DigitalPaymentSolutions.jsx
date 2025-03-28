import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  Lock, 
  QrCode, 
  Send, 
  Shield, 
  Zap 
} from 'lucide-react';

const DigitalPaymentSolutions = () => {
  const [activeService, setActiveService] = useState('mobilePayments');

  const paymentServices = {
    mobilePayments: {
      title: 'Mobile Payment Solutions',
      description: 'Seamless payment experiences across mobile devices and platforms.',
      features: [
        'Multi-platform compatibility',
        'One-tap payment processing',
        'Biometric authentication',
        'Real-time transaction tracking'
      ],
      benefits: [
        'Enhanced user convenience',
        'Reduced checkout friction',
        'Improved security measures',
        'Instant payment confirmations'
      ],
      details: {
        supportedPlatforms: 'iOS, Android, Web',
        transactionSpeed: 'Under 2 seconds',
        securityProtocol: 'End-to-end encryption',
        supportedCurrencies: '20+ currencies'
      }
    },
    ecommerceSolutions: {
      title: 'E-commerce Payment Gateway',
      description: 'Comprehensive payment integration for online businesses.',
      features: [
        'Multiple payment method support',
        'Fraud detection system',
        'Global payment acceptance',
        'Customizable checkout experience'
      ],
      benefits: [
        'Increased conversion rates',
        'Reduced cart abandonment',
        'Seamless international transactions',
        'Simplified financial reporting'
      ],
      details: {
        integrationTime: '1-2 weeks',
        supportedPaymentMethods: '15+ methods',
        transactionFees: '1.9% - 2.9%',
        monthlyVolume: 'Unlimited'
      }
    },
    qrCodePayments: {
      title: 'QR Code Payment System',
      description: 'Innovative contactless payment technology for businesses.',
      features: [
        'Dynamic QR code generation',
        'Merchant-specific codes',
        'Instant payment verification',
        'Cross-platform compatibility'
      ],
      benefits: [
        'Contactless transaction method',
        'Reduced cash handling',
        'Lower transaction costs',
        'Enhanced customer experience'
      ],
      details: {
        generationSpeed: 'Instant',
        supportedDevices: 'All smartphones',
        transactionLimit: '$10,000',
        settlementTime: '24-48 hours'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-11">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service Navigation */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Digital Payments</h2>
          <div className="space-y-2">
            {Object.keys(paymentServices).map((key) => (
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
                {key === 'mobilePayments' && <Smartphone className="mr-3" />}
                {key === 'ecommerceSolutions' && <Globe className="mr-3" />}
                {key === 'qrCodePayments' && <QrCode className="mr-3" />}
                {paymentServices[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Service Details Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {paymentServices[activeService].title}
              </h1>
              <p className="text-gray-600 mt-2">
                {paymentServices[activeService].description}
              </p>
            </div>
            {activeService === 'mobilePayments' && <Smartphone size={48} className="text-blue-500" />}
            {activeService === 'ecommerceSolutions' && <Globe size={48} className="text-green-500" />}
            {activeService === 'qrCodePayments' && <QrCode size={48} className="text-purple-500" />}
          </div>

          {/* Service Features and Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Features</h3>
              <ul className="space-y-3">
                {paymentServices[activeService].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Zap className="mr-3 text-yellow-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Benefits</h3>
              <ul className="space-y-3">
                {paymentServices[activeService].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Send className="mr-3 text-blue-500 flex-shrink-0" size={20} />
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
              {Object.entries(paymentServices[activeService].details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2 last:border-b-0">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Assurance Section */}
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Lock className="mr-3 text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">
                Advanced Security Measures
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our digital payment solutions prioritize security with cutting-edge technologies 
              and robust protection mechanisms.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Shield className="text-green-500 mb-2" size={32} />
                <h4 className="font-semibold">Encryption</h4>
                <p className="text-sm text-gray-600">End-to-end security</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <CreditCard className="text-blue-500 mb-2" size={32} />
                <h4 className="font-semibold">Fraud Detection</h4>
                <p className="text-sm text-gray-600">Real-time monitoring</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Lock className="text-purple-500 mb-2" size={32} />
                <h4 className="font-semibold">Compliance</h4>
                <p className="text-sm text-gray-600">PCI DSS certified</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Ready to Transform Your Payments?
              </h3>
              <p className="text-gray-600 mt-2">
                Explore our digital payment solutions tailored to your business needs.
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

export default DigitalPaymentSolutions;