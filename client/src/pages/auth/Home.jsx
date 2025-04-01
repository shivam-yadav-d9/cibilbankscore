import React from "react";
import Carousel from "./Carousel";
import {
  Award,
  Network,
  MessageCircle,
  Check,
  TrendingUp,
  Shield,
} from "lucide-react";

const Home = () => {
  const images = [
    {
      src: "https://finvestor.co.in/wp-content/uploads/2024/03/bank.png",
      alt: "First slide",
      caption: "Digital Banking Solutions",
    },
    {
      src: "https://navi.com/blog/wp-content/uploads/2022/06/Credit-Score-vs-CIBIL-Score.jpg",
      alt: "Second slide",
      caption: "Credit Management",
    },
    {
      src: "https://vakrangee.in/images/banner/Technology-Banner.jpg",
      alt: "Third slide",
      caption: "Advanced Technology Infrastructure",
    },
  ];

  const keyFeatures = [
    {
      icon: TrendingUp,
      title: "Financial Innovation",
      description:
        "Pioneering cutting-edge financial technologies and solutions.",
    },
    {
      icon: Shield,
      title: "Secure Ecosystem",
      description:
        "Robust security infrastructure protecting every transaction.",
    },
    {
      icon: Network,
      title: "Comprehensive Network",
      description:
        "Seamless digital infrastructure across urban and rural India.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Carousel */}
      <div className="relative w-full">
        <Carousel
          images={images}
          autoPlayInterval={4000}
          showControls={true}
          showIndicators={true}
        />
      </div>

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Our Strategic Advantages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            DBNPE is committed to redefining financial services through
            technological excellence and customer-centric approach.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <feature.icon
                className="mx-auto mb-4 sm:mb-6 text-blue-600"
                size={40}
                strokeWidth={1.5}
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About DBNPE Section */}
      <section className="bg-blue-50 py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                What is DBNPE?
              </h2>
              <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                DBNPE represents a revolutionary approach to digital banking and
                financial services, leveraging advanced technologies to create
                an inclusive, efficient, and transparent financial ecosystem.
              </p>
              <ul className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center">
                  <Check className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" size={20} />
                  <span>Advanced Digital Banking Solutions</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" size={20} />
                  <span>Comprehensive Financial Inclusion</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" size={20} />
                  <span>Secure and Transparent Transactions</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <Award
                className="mx-auto text-blue-600 mb-4 sm:mb-6"
                size={50}
                strokeWidth={1.5}
              />
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-3 sm:mb-4 text-gray-800">
                Our Vision
              </h3>
              <p className="text-gray-600 text-center text-sm sm:text-base">
                To be the most trusted and innovative digital banking platform,
                driving financial empowerment and technological advancement
                across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="bg-blue-800 text-white py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <MessageCircle
              className="mx-auto mb-4 sm:mb-8 text-white"
              size={40}
              strokeWidth={1.5}
            />
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Leadership Perspective</h2>
            <blockquote className="italic text-lg sm:text-2xl mb-6 sm:mb-8 leading-relaxed">
              "Our commitment goes beyond technology. We are building a
              financial ecosystem that empowers every individual, transforms
              digital experiences, and creates meaningful economic opportunities
              across India."
            </blockquote>
            <p className="font-semibold text-base sm:text-xl text-blue-100">
              - Pravin More.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;