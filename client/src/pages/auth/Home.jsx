import React from "react";
import Carousel from "./Carousel";
import {
  Award,
  Network,
  MessageCircle,
  Check,
  TrendingUp,
  Shield
} from "lucide-react";

const Home = () => {
  const images = [
    {
      src: "https://vakrangee.in/images/banner/banner_1.jpg",
      alt: "First slide",
    },
    {
      src: "https://vakrangee.in/images/banner/banner_3.jpg",
      alt: "Second slide",
    },
    {
      src: "https://vakrangee.in/images/banner/Technology-Banner.jpg",
      alt: "Third slide",
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
      <div className="relative">
        <Carousel
          images={images}
          autoPlayInterval={4000}
          showControls={true}
          showIndicators={true}
        />
      </div>

      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Strategic Advantages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            DBNPE is committed to redefining financial services through
            technological excellence and customer-centric approach.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <feature.icon
                className="mx-auto mb-6 text-blue-600"
                size={60}
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About DBNPE Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                What is DBNPE?
              </h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                DBNPE represents a revolutionary approach to digital banking and
                financial services, leveraging advanced technologies to create
                an inclusive, efficient, and transparent financial ecosystem.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <Check className="mr-3 text-blue-600" />
                  Advanced Digital Banking Solutions
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 text-blue-600" />
                  Comprehensive Financial Inclusion
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 text-blue-600" />
                  Secure and Transparent Transactions
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Award
                className="mx-auto text-blue-600 mb-6"
                size={70}
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                Our Vision
              </h3>
              <p className="text-gray-600 text-center">
                To be the most trusted and innovative digital banking platform,
                driving financial empowerment and technological advancement
                across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <MessageCircle
              className="mx-auto mb-8 text-white"
              size={70}
              strokeWidth={1.5}
            />
            <h2 className="text-4xl font-bold mb-6">Leadership Perspective</h2>
            <blockquote className="italic text-2xl mb-8 leading-relaxed">
              "Our commitment goes beyond technology. We are building a
              financial ecosystem that empowers every individual, transforms
              digital experiences, and creates meaningful economic opportunities
              across India."
            </blockquote>
            <p className="font-semibold text-xl text-blue-100">
              - Dr. Dinesh Nayar, Chairman Emeritus
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;