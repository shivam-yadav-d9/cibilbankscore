import React from 'react';

const CareerPage = () => {
  const careerSections = [
    {
      id: 1,
      title: 'Culture & Valorage',
      description: 'We believe in giving equal opportunities and maintaining an ethical, non-discriminatory and inclusive central environment at the workplace.',
      color: 'bg-gray-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      ),
      buttonText: 'Read More'
    },
    {
      id: 2,
      title: 'Learning & Development',
      description: 'Valorange offers multiple learning & development opportunities to employees at various stages of their career.',
      color: 'bg-orange-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
          <path d="M12 19l7-7 3 3-7-7"></path>
          <path d="M19 17h3v-3"></path>
          <path d="M5 14l-3-3 4-4 3 3"></path>
          <path d="M12 14h3"></path>
        </svg>
      ),
      buttonText: 'Read More'
    },
    {
      id: 3,
      title: 'Benefits',
      description: 'We offer excellent compensation and perks to our employees. Join us and take the best care of our human capital.',
      color: 'bg-teal-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
          <path d="M17 18a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1z"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      buttonText: 'View Our Benefits'
    },
    {
      id: 4,
      title: 'Open Positions',
      description: 'Have a look at our current openings to see if there is a perfect fit for you!',
      color: 'bg-gray-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      ),
      buttonText: 'View Our Openings'
    },
    {
      id: 5,
      title: 'Job Applications',
      description: 'Our team is made up of hard-working, professional and talented individuals. We are always looking for talented professionals to join our team.',
      color: 'bg-purple-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      ),
      buttonText: 'Join Our Team'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Why Work With Us
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              See Current Openings
            </button>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-3 grid-cols-1">
        {careerSections.map((section, index) => (
          <div 
            key={section.id} 
            className={`${section.color} p-8 flex flex-col items-center justify-center text-center relative group`}
          >
            <div className="mb-6">
              {section.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
            <p className="text-white mb-6 max-w-xs">{section.description}</p>
            <button className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
              {section.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Footer-like Section */}
      <div className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Here at Valorange, we look for people like you
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join our team and be part of something extraordinary
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg">
          See Current Openings
        </button>
      </div>
    </div>
  );
};

export default CareerPage;