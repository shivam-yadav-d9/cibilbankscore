import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  BarChart2,
  FileText,
  Shield,
  Landmark,
  Phone,
  Users,
  ExternalLink,
  TrendingUp,
  Bell
} from "lucide-react";
import FeaturedServices from "./FeaturedServices";
import { useTheme } from "../../contexts/ThemeContext";

const Dashboard = () => {
  const { isDarkMode } = useTheme();

  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to calculate tilt based on mouse position for 3D hover effect
  const calculateTilt = (element, multiplier = 10) => {
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const x = mousePosition.x - rect.left - rect.width / 2;
    const y = mousePosition.y - rect.top - rect.height / 2;
    return { 
      x: y / multiplier, 
      y: -x / multiplier 
    };
  };

  // 3D Card Component
  const FeatureCard = ({ icon: Icon, title, description, link, color, hoverColor, iconBg, iconHoverBg }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = React.useRef(null);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    };
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const calculated = calculateTilt(cardRef.current, 20);
        setTilt(calculated);
      }
    };

    // Theme-based card background
    const cardBg = isDarkMode
      ? "bg-slate-900/90 border-slate-800/80"
      : "bg-white/90 border-slate-100/80";
    const cardText = isDarkMode ? "text-slate-100" : "text-slate-900";
    const descText = isDarkMode ? "text-slate-400" : "text-slate-600";

    return (
      <Link to={link} className="group">
        <div 
          ref={cardRef}
          className={`backdrop-blur-md h-full rounded-2xl p-6 shadow-lg hover:shadow-2xl border flex flex-col relative overflow-hidden transition-all duration-500 transform ${cardBg}`}
          style={{ 
            transform: isHovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)` : 'perspective(1000px) rotateX(0) rotateY(0)',
            boxShadow: isHovered ? `0 30px 60px rgba(0, 0, 0, 0.15), 0 0 15px ${color}40` : ''
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Background gradient effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ 
              background: `radial-gradient(circle at ${isHovered ? '50% 50%' : '100% 100%'}, ${color}, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
          {/* Glossy line effect */}
          <div 
            className="absolute h-1 top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              transform: isHovered ? 'translateX(0%)' : 'translateX(-100%)'
            }}
          />
          {/* Icon with 3D effect */}
          <div 
            className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 relative z-10`}
            style={{ 
              background: isHovered ? iconHoverBg : iconBg,
              transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
              boxShadow: isHovered ? `0 15px 30px ${color}30` : '0 5px 15px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Icon
              className="transition-all duration-500"
              style={{ 
                color: isHovered ? 'white' : color,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
              size={28}
            />
          </div>
          {/* Content */}
          <h3 
            className={`text-xl font-bold mb-3 transition-colors duration-500 relative z-10 ${cardText}`}
            style={{ color: isHovered ? color : undefined }}
          >
            {title}
          </h3>
          <p className={`text-sm mb-5 flex-grow relative z-10 ${descText}`}>
            {description}
          </p>
          {/* Action button with animated arrow */}
          <div 
            className="flex items-center font-medium text-sm relative z-10 transition-all duration-500"
            style={{ color: color }}
          >
            <span>Get Started</span>
            <ArrowRight
              size={16}
              className="ml-1 group-hover:ml-3 transition-all duration-500"
              style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
            />
          </div>
        </div>
      </Link>
    );
  };

  // Theme-based backgrounds
  const mainBg = isDarkMode
    ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    : "bg-gradient-to-b from-blue-100 via-indigo-100 to-white";

  return (
    <div className={`min-h-screen ${mainBg}`}>
      <FeaturedServices />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: isDarkMode
              ? 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)'
              : 'linear-gradient(to right, #a5b4fc 1px, transparent 1px), linear-gradient(to bottom, #a5b4fc 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            transform: `translateY(${scrollY * 0.2}px)` 
          }}
        />
        {/* Floating gradient orbs */}
        <div className={`absolute top-1/4 -left-32 w-96 h-96 ${isDarkMode ? "bg-blue-500" : "bg-blue-300"} rounded-full opacity-20 blur-3xl`} 
          style={{ transform: `translate(${scrollY * 0.1}px, ${-scrollY * 0.05}px)` }}
        />
        <div className={`absolute bottom-1/3 -right-32 w-96 h-96 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"} rounded-full opacity-20 blur-3xl`}
          style={{ transform: `translate(${-scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        />
        <div className={`absolute top-2/3 left-1/4 w-64 h-64 ${isDarkMode ? "bg-purple-500" : "bg-purple-300"} rounded-full opacity-10 blur-3xl`}
          style={{ transform: `translate(${scrollY * 0.15}px, ${-scrollY * 0.1}px)` }}
        />
      </div>

      {/* Navigation bar with glassmorphism */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? "bg-slate-900/50" : "bg-white/60"} backdrop-blur-lg border-b ${isDarkMode ? "border-white/10" : "border-slate-200/60"}`}>
      </div> 

      {/* Main content wrapper with padding for navbar */}
      <div className="relative pt-8">
        {/* Hero Section with 3D elements */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div 
            className={`rounded-3xl overflow-hidden border shadow-2xl relative ${isDarkMode ? "bg-slate-900/80 border-white/20" : "bg-white/10 border-slate-200/60"}`}
            style={{ 
              transform: `perspective(1000px) rotateX(${scrollY * 0.01}deg)`,
              boxShadow: isDarkMode
                ? '0 50px 100px rgba(0, 0, 0, 0.5), 0 0 30px rgba(79, 70, 229, 0.15)'
                : '0 50px 100px rgba(180, 200, 255, 0.2), 0 0 30px rgba(180, 200, 255, 0.15)'
            }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                {/* Subtle animated line */}
                <div className={`h-1 w-24 rounded-full mb-8 ${isDarkMode ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-blue-300 to-indigo-300"}`} />
                <h1 className={`text-5xl md:text-6xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    Next-Gen
                  </span>
                  <br />
                  <span className={isDarkMode ? "text-white" : "text-slate-900"}>Banking Solution</span>
                </h1>
                <p className={`mt-6 text-lg max-w-lg ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Unlock financial freedom with DBNpe - elevating your banking experience with AI-powered insights and seamless management tools.
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <button className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                    <button className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-10 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-3 group-hover:shadow-indigo-500/50">
                      Get Started
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </button>
                  <button className={`py-4 px-10 rounded-xl font-medium transition-all border flex items-center gap-2 ${isDarkMode ? "text-white border-white/20 hover:bg-white/10" : "text-slate-900 border-slate-200/60 hover:bg-slate-100/60"} backdrop-blur-md`}>
                    Learn More
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 p-6 flex items-center justify-center relative">
                {/* Animated background elements */}
                <div className={`absolute top-1/4 right-1/4 w-64 h-64 ${isDarkMode ? "bg-blue-500" : "bg-blue-300"} rounded-full opacity-20 blur-3xl animate-pulse`} />
                {/* 3D floating image */}
                <div 
                  className="relative w-full max-w-md transform transition-all duration-1000"
                  style={{ 
                    transform: `perspective(1000px) rotateY(${-scrollY * 0.02}deg) rotateX(${scrollY * 0.01}deg) translateZ(50px)`,
                  }}
                >
                  <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-50 ${isDarkMode ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-blue-200 to-indigo-200"}`}></div>
                  <img
                    src="/auth.png"
                    alt="Banking Dashboard"
                    className="relative rounded-2xl shadow-2xl object-cover w-full border"
                    style={{
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(180,200,255,0.3)",
                      boxShadow: isDarkMode
                        ? '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 30px rgba(79, 70, 229, 0.2)'
                        : '0 30px 60px rgba(180, 200, 255, 0.2), 0 0 30px rgba(180, 200, 255, 0.15)'
                    }}
                  />
                  {/* Floating elements around the image */}
                  <div className={`absolute -top-6 -right-6 h-16 w-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 border ${isDarkMode ? "border-white/20" : "border-slate-200/60"}`}>
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <div className={`absolute -bottom-8 -left-8 h-20 w-48 ${isDarkMode ? "bg-white/10" : "bg-slate-100/60"} backdrop-blur-xl rounded-xl p-3 shadow-lg border ${isDarkMode ? "border-white/20" : "border-slate-200/60"}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <Shield className="text-white" size={20} />
                      </div>
                      <div>
                        <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Security Score</div>
                        <div className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Excellent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Services with floating cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative">
          <div 
            className={`rounded-3xl shadow-2xl p-12 border overflow-hidden relative ${isDarkMode ? "bg-slate-900/80 border-white/10" : "bg-white/5 border-slate-200/60"}`}
            style={{
              boxShadow: isDarkMode
                ? '0 30px 80px rgba(0, 0, 0, 0.3), 0 0 20px rgba(79, 70, 229, 0.2)'
                : '0 30px 80px rgba(180, 200, 255, 0.15), 0 0 20px rgba(180, 200, 255, 0.1)'
            }}
          >
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-0 left-0 w-full h-1 ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500 to-transparent" : "bg-gradient-to-r from-transparent via-blue-300 to-transparent"} opacity-30`}></div>
              <div className={`absolute bottom-0 left-0 w-full h-1 ${isDarkMode ? "bg-gradient-to-r from-transparent via-indigo-500 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-300 to-transparent"} opacity-30`}></div>
              <div className={`absolute -top-40 -right-40 w-80 h-80 ${isDarkMode ? "bg-blue-500" : "bg-blue-200"} rounded-full opacity-10 blur-3xl`}></div>
              <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-200"} rounded-full opacity-10 blur-3xl`}></div>
            </div>
            <h2 className="text-3xl font-bold mb-12 relative z-10">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                All Services
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {/* Service Items with hover effects */}
              {[
                { icon: Shield, label: "Insurance", color: "#3b82f6" },
                { icon: BarChart2, label: "Financial Analytics", color: "#6366f1" },
                { icon: Phone, label: "Stop Recovery Call", color: "#a855f7" },
                { icon: FileText, label: "Bill Payment", color: "#14b8a6" },
                { icon: CreditCard, label: "Split EMI", color: "#ec4899" }
              ].map((service, index) => (
                <div 
                  key={index}
                  className={`group p-6 rounded-xl border hover:border-white/30 transition-all duration-500 hover:shadow-lg ${isDarkMode ? "bg-slate-900/60 border-white/10" : "bg-white/5 border-slate-200/60"}`}
                  style={{
                    transform: `perspective(1000px) translateZ(0px)`,
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) translateZ(20px)';
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px ${service.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) translateZ(0px)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div 
                      className="h-14 w-14 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-500"
                      style={{ 
                        background: `linear-gradient(135deg, ${service.color}20, ${service.color}40)`,
                        boxShadow: `0 5px 15px ${service.color}20`
                      }}
                    >
                      <service.icon 
                        className="transition-all duration-500"
                        style={{ color: service.color }}
                        size={24}
                      />
                    </div>
                    <span className={`font-medium text-sm group-hover:text-blue-300 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {service.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;