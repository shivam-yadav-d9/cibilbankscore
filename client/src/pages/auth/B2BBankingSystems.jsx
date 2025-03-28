import React from 'react';
import { Building2, CreditCard, PieChart, ShieldCheck, Globe, DollarSign} from 'lucide-react';

const B2BBankingSystems = () => {
  const features = [
    {
      icon: <Building2 className="w-12 h-12 text-blue-600" />,
      title: "Corporate Treasury Management",
      description: "Streamline cash flow, manage multiple accounts, and optimize financial operations with our comprehensive treasury solutions."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-green-600" />,
      title: "Payment Solutions",
      description: "Seamless international and domestic payment processing with real-time tracking and advanced security protocols."
    },
    {
      icon: <PieChart className="w-12 h-12 text-purple-600" />,
      title: "Financial Analytics",
      description: "Advanced reporting and predictive analytics to drive strategic business decisions and financial planning."
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-red-600" />,
      title: "Risk Management",
      description: "Comprehensive risk assessment tools and compliance monitoring to protect your business's financial integrity."
    }
  ];

  const benefits = [
    "Unified financial ecosystem",
    "Multi-currency support",
    "Custom integration capabilities",
    "24/7 enterprise support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full mt-11">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Enterprise B2B Banking Solutions
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Empower your business with cutting-edge financial technology designed for scalable, secure, and intelligent banking operations.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Request Demo
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              Contact Sales
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <img 
            src="/api/placeholder/600/400" 
            alt="B2B Banking Dashboard" 
            className="rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Enterprise Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-100 p-6 rounded-xl text-center hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Unlock Business Potential
          </h2>
          <p className="text-gray-600 mb-8">
            Our B2B banking platform is designed to transform your financial operations, providing unparalleled efficiency and strategic insights.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-3">
                <ShieldCheck className="text-green-500 w-6 h-6" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-xl text-center">
            <DollarSign className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h4 className="font-bold text-xl">$10M+</h4>
            <p className="text-gray-600">Annual Transaction Volume</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl text-center">
            <Globe className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h4 className="font-bold text-xl">50+</h4>
            <p className="text-gray-600">Countries Supported</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Business Banking?
          </h2>
          <p className="text-lg mb-8">
            Schedule a personalized consultation and discover how our B2B banking solutions can elevate your financial strategy.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition">
              Get Started
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BBankingSystems;