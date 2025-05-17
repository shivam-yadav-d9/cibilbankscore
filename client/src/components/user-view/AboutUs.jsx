import React from 'react';
import { 
  Target, 
  Shield, 
  Globe, 
  Rocket, 
  TreePine, 
  Users 
} from 'lucide-react';
// this is about us page
const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: "Innovative Solutions",
      description: "Pioneering cutting-edge financial technologies that transform traditional banking experiences."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Implementing state-of-the-art security protocols to protect our customers' financial assets."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Breaking barriers and making financial services available to businesses and individuals alike."
    }
  ];

  const milestones = [
    { year: 2018, event: "Company Founded" },
    { year: 2024, event: "Official Incorporation" }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            About DBNPE 
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A pioneering financial and banking services provider delivering 
            innovative solutions that bridge traditional banking with modern fintech.
          </p>
        </div>

        {/* Company Description */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Vision
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              DBNPE is committed to transforming financial services by providing 
              secure, scalable, and seamless experiences. We cater to the unique 
              needs of entrepreneurs, enterprises, and individuals, ensuring 
              financial accessibility and innovation.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-8 shadow-lg">
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">
              Key Milestones
            </h4>
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="flex items-center mb-4 last:mb-0"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full 
                                flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {milestone.year}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-50 rounded-xl p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index} 
                  className="text-center bg-white rounded-xl 
                             p-6 shadow-md hover:shadow-xl 
                             transition-all duration-300"
                >
                  <div className="mx-auto mb-6 w-16 h-16 
                                  bg-blue-100 rounded-full 
                                  flex items-center justify-center">
                    <Icon 
                      className="text-blue-600" 
                      size={32} 
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h4>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;