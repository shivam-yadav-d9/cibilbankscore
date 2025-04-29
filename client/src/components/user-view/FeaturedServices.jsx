import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Landmark,
  Users,
  FileText,
  Shield,
  ArrowRight,
  Zap,
  BarChart2,
  Globe,
  Cpu
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const FeaturedServices = () => {
  const { isDarkMode } = useTheme();

  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate tilt based on mouse position for 3D hover effect
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

  // Enhanced 3D Card Component with more futuristic elements
  const FeatureCard = ({
    icon: Icon,
    title,
    description,
    link,
    color,
    accent,
    index
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
      setIsHovered(true);
      setActiveCard(index);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
      setActiveCard(null);
    };

    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const calculated = calculateTilt(cardRef.current, 20);
        setTilt(calculated);
      }
    };

    // Dynamic background gradient based on card position
    const gradientDeg = 45 + (index * 20);

    // Theme-based backgrounds
    const cardBg = isDarkMode
      ? 'linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.08))'
      : 'linear-gradient(to bottom right, #fff, #f3f6fd)';
    const cardBorder = isDarkMode
      ? {
          borderTop: `1px solid rgba(255,255,255,0.1)`,
          borderLeft: `1px solid rgba(255,255,255,0.1)`,
          borderRight: `1px solid rgba(0,0,0,0.1)`,
          borderBottom: `1px solid rgba(0,0,0,0.1)`
        }
      : {
          border: `1px solid #e0e7ff`
        };

    return (
      <div
        className="group relative"
        style={{
          zIndex: isHovered ? 10 : 1,
          transform: `translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.02 : 1})`,
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0.1s"
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(${gradientDeg}deg, ${color}90, ${accent}90)`,
            filter: 'blur(15px)',
            zIndex: -1
          }}
        />
        <Link to={link}>
          <div
            ref={cardRef}
            className="h-full rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all duration-500 transform cursor-pointer"
            style={{
              background: cardBg,
              backdropFilter: isDarkMode ? "blur(10px)" : "none",
              boxShadow: isHovered
                ? `0 25px 50px rgba(0,0,0,0.3), 0 0 20px ${color}40, inset 0 0 20px rgba(255,255,255,0.05)`
                : '0 15px 30px rgba(0,0,0,0.08), inset 0 0 20px rgba(255,255,255,0.05)',
              transform: isHovered
                ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : 'perspective(1000px) rotateX(0) rotateY(0)',
              ...cardBorder
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {/* Digital circuit pattern background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h100v1H0zM0 99h100v1H0zM0 0h1v100H0zM99 0h1v100h-1zM25 25h1v50h-1zM75 25h1v50h-1zM25 25h50v1H25zM25 75h50v1H25zM50 25h1v50h-1z' fill='%23${color.replace('#', '')}' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            />
            {/* Animated highlight line */}
            <div
              className="absolute h-px top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-1000"
              style={{
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                transform: isHovered ? 'translateX(0%)' : 'translateX(-100%)',
                animation: isHovered ? 'pulse 2s infinite' : 'none'
              }}
            />
            {/* Animated bottom highlight line */}
            <div
              className="absolute h-px bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-1000"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                transform: isHovered ? 'translateX(0%)' : 'translateX(100%)',
                animation: isHovered ? 'pulse 2s infinite' : 'none'
              }}
            />
            {/* Enhanced icon with hover effects */}
            <div className="relative mb-6">
              {/* Icon background glow */}
              <div
                className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-70 transition-all duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${color}80, transparent 70%)`,
                  filter: 'blur(10px)',
                  transform: isHovered ? 'scale(1.2)' : 'scale(0.9)'
                }}
              />
              {/* Icon container */}
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center relative z-10"
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${color}, ${accent})`
                    : isDarkMode
                      ? `rgba(255,255,255,0.05)`
                      : `#f1f5ff`,
                  boxShadow: isHovered
                    ? `0 10px 20px rgba(0,0,0,0.2), 0 0 10px ${color}50, inset 0 0 10px rgba(255,255,255,0.1)`
                    : 'inset 0 0 10px rgba(255,255,255,0.05)',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <Icon
                  className="transition-all duration-500 relative z-10"
                  style={{
                    color: isHovered ? 'white' : color,
                    filter: isHovered ? 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' : 'none',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                  size={28}
                />
                {/* Animated ring */}
                <div
                  className="absolute inset-0 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100"
                  style={{
                    animation: isHovered ? 'pulse 2s infinite' : 'none'
                  }}
                />
              </div>
            </div>
            {/* Content */}
            <h3
              className={`text-xl font-bold mb-3 relative z-10 flex items-center space-x-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
              style={{
                color: isHovered ? 'white' : undefined,
                textShadow: isHovered ? `0 0 10px ${color}80` : 'none'
              }}
            >
              <span>{title}</span>
              {isHovered && (
                <Zap size={16} className="text-yellow-300 animate-pulse" />
              )}
            </h3>
            <p
              className={`text-sm mb-5 flex-grow relative z-10 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
              style={{
                color: isHovered ? (isDarkMode ? 'rgb(226,232,240)' : '#22223b') : undefined,
                transition: 'color 0.3s ease'
              }}
            >
              {description}
            </p>
            {/* Enhanced action button */}
            <div
              className="flex items-center font-medium text-sm relative z-10 mt-auto"
              style={{
                color: isHovered ? 'white' : color,
                textShadow: isHovered ? `0 0 5px ${color}80` : 'none'
              }}
            >
              <span>Explore</span>
              <div className="relative ml-2">
                <ArrowRight
                  size={16}
                  className="transition-all duration-500"
                  style={{
                    transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                    opacity: isHovered ? 0 : 1
                  }}
                />
                <ArrowRight
                  size={16}
                  className="absolute top-0 left-0 transition-all duration-500"
                  style={{
                    transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: isHovered ? 1 : 0
                  }}
                />
              </div>
            </div>
            {/* Animated corner dots */}
            <div className="absolute top-2 right-2 h-1 w-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>
    );
  };

  const servicesData = [
    {
      icon: CreditCard,
      title: "Credit Score",
      description: "AI-powered credit monitoring with real-time insights and personalized improvement strategies.",
      link: "/credit-check",
      color: "#3b82f6",
      accent: "#60a5fa"
    },
    {
      icon: Landmark,
      title: "Apply for Loan",
      description: "Next-gen loan processing with instant approval and dynamic interest rates adjusted to your financial health.",
      link: "/UserLoanpage",
      color: "#6366f1",
      accent: "#818cf8"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with AI-matched financial advisors and join exclusive investment communities.",
      link: "/expert-connect",
      color: "#a855f7",
      accent: "#c084fc"
    },
    {
      icon: FileText,
      title: "Legal Guardian",
      description: "Automated legal document analysis and AI-powered contract protection for your financial decisions.",
      link: "/CustomerLegalAdvice",
      color: "#14b8a6",
      accent: "#2dd4bf"
    },
    {
      icon: Shield,
      title: "Cyber Vault",
      description: "Quantum-encrypted data protection with biometric authentication for all your financial assets.",
      link: "/cyber-vault",
      color: "#f43f5e",
      accent: "#fb7185"
    },
    {
      icon: Globe,
      title: "Global Payments",
      description: "Borderless transactions with real-time currency conversion and zero hidden fees.",
      link: "/global-payments",
      color: "#8b5cf6",
      accent: "#a78bfa"
    },
    {
      icon: BarChart2,
      title: "AI Investment Advisor",
      description: "Personalized portfolio management with predictive market analysis and risk assessment.",
      link: "/investment-advisor",
      color: "#10b981",
      accent: "#34d399"
    },
    {
      icon: Cpu,
      title: "Digital Asset Hub",
      description: "Secure platform for cryptocurrency, NFTs, and traditional assets management in one place.",
      link: "/digital-assets",
      color: "#f59e0b",
      accent: "#fbbf24"
    }
  ];

  // Section background based on theme
  const sectionBg = isDarkMode
    ? 'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,1))'
    : 'linear-gradient(to bottom, #f8fafc 0%, #e0e7ff 100%)';

  return (
    <div
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: sectionBg
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(99,102,241,0.07) 0%, transparent 70%)',
            backgroundSize: '100px 100px',
            backgroundPosition: 'center',
            transform: `scale(${1 + scrollY * 0.0005})`
          }}
        />
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 50%)',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>
      {/* Content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with futuristic design */}
        <div className="mb-16 text-center relative">
          <div className="inline-block">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2 space-x-2">
                <div className={`h-px w-12 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"} opacity-50`} />
                <div className={`text-indigo-400 text-sm font-medium tracking-wider uppercase`}>
                  Featured Services
                </div>
                <div className={`h-px w-12 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"} opacity-50`} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Futuristic Banking
                </span>
              </h2>
              <div className="mt-4 max-w-2xl mx-auto">
                <p className={`text-lg ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Discover our cutting-edge financial services powered by advanced AI and quantum technologies
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.slice(0, 8).map((service, index) => (
            <FeatureCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
              color={service.color}
              accent={service.accent}
              index={index}
            />
          ))}
        </div>
        {/* Section footer with CTA */}
        <div className="mt-16 text-center">
          <button className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedServices;