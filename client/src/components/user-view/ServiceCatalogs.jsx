import { useState, useEffect } from "react";
import {
  ArrowRight,
  Star,
  Shield,
  AlertTriangle,
  Award,
  Zap,
} from "lucide-react";

const ServiceCatalogs = () => {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    // Get user data from localStorage
    const dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
    const userData = JSON.parse(localStorage.getItem("user"));

    if (dashboardData && userData) {
      setUser({
        name: userData.name,
        email: userData.email,
        creditScore: dashboardData.creditScore || 0,
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-400"></div>
      </div>
    );
  }

  // Define service categories
  const categories = [
    { id: "all", name: "All Services" },
    { id: "credit", name: "Credit Services" },
    { id: "loans", name: "Loan Services" },
    { id: "financial", name: "Financial Planning" },
    { id: "premium", name: "Premium Services" },
  ];

  // Get icon component based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "credit":
        return "📊";
      case "loans":
        return "💰";
      case "financial":
        return "📋";
      case "premium":
        return "⭐";
      default:
        return "🔍";
    }
  };

  // Define all services with their credit score requirements
  const allServices = [
    {
      id: 1,
      title: "Basic Credit Report",
      description: "Access your basic credit report with score and summary.",
      category: "credit",
      icon: "📊",
      free: true,
      minCreditScore: 0,
      ctaText: "View Report",
    },
    {
      id: 2,
      title: "Credit Score Monitoring",
      description: "Get monthly updates on your credit score changes.",
      category: "credit",
      icon: "📈",
      free: true,
      minCreditScore: 0,
      ctaText: "Activate Now",
    },
    {
      id: 3,
      title: "Credit Improvement Plan",
      description: "Personalized plan to improve your credit score.",
      category: "credit",
      icon: "🔍",
      free: false,
      minCreditScore: 0,
      ctaText: "Get Plan",
      price: "₹399/month",
    },
    {
      id: 4,
      title: "Personal Loan Eligibility",
      description: "Check your eligibility for personal loans from top banks.",
      category: "loans",
      icon: "💰",
      free: true,
      minCreditScore: 0,
      ctaText: "Check Eligibility",
    },
    {
      id: 5,
      title: "Pre-approved Loan Offers",
      description: "View pre-approved loan offers tailored to your profile.",
      category: "loans",
      icon: "🏦",
      free: false,
      minCreditScore: 650,
      ctaText: "View Offers",
      price: "₹199/month",
    },
    {
      id: 6,
      title: "Home Loan Rate Comparison",
      description: "Compare home loan interest rates from multiple lenders.",
      category: "loans",
      icon: "🏠",
      free: true,
      minCreditScore: 0,
      ctaText: "Compare Rates",
    },
    {
      id: 7,
      title: "Credit Card Recommendations",
      description:
        "Get personalized credit card recommendations based on your profile.",
      category: "financial",
      icon: "💳",
      free: true,
      minCreditScore: 600,
      ctaText: "View Cards",
    },
    {
      id: 8,
      title: "Investment Advisory",
      description:
        "Personalized investment recommendations based on your financial goals.",
      category: "financial",
      icon: "📋",
      free: false,
      minCreditScore: 700,
      ctaText: "Get Advice",
      price: "₹599/month",
    },
    {
      id: 9,
      title: "Tax Planning Services",
      description:
        "Optimize your tax strategy with personalized recommendations.",
      category: "financial",
      icon: "📝",
      free: false,
      minCreditScore: 650,
      ctaText: "Plan Taxes",
      price: "₹499/quarter",
    },
    {
      id: 10,
      title: "Premium Credit Analysis",
      description:
        "In-depth analysis of your credit report with expert recommendations.",
      category: "premium",
      icon: "🔎",
      free: false,
      minCreditScore: 750,
      ctaText: "Get Analysis",
      price: "₹999/quarter",
    },
    {
      id: 11,
      title: "Priority Loan Processing",
      description:
        "Get your loan applications processed on priority with our partner banks.",
      category: "premium",
      icon: "⚡",
      free: false,
      minCreditScore: 750,
      ctaText: "Activate",
      price: "₹1,499/year",
    },
    {
      id: 12,
      title: "Financial Wellness Score",
      description: "Comprehensive assessment of your overall financial health.",
      category: "premium",
      icon: "📈",
      free: false,
      minCreditScore: 700,
      ctaText: "Get Score",
      price: "₹799/year",
    },
  ];

  // Filter services based on active category and user's credit score
  const filteredServices = allServices.filter(
    (service) =>
      (activeCategory === "all" || service.category === activeCategory) &&
      user.creditScore >= service.minCreditScore
  );

  // Get credit score status and related UI elements
  const getCreditScoreStatus = (score) => {
    if (score === 0)
      return {
        text: "No Credit History",
        color: "text-slate-400",
        bgColor: "bg-slate-800",
        icon: <AlertTriangle className="h-6 w-6 text-slate-400" />,
      };
    if (score < 600)
      return {
        text: "Poor",
        color: "text-red-400",
        bgColor: "bg-red-900/20",
        icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
      };
    if (score < 650)
      return {
        text: "Average",
        color: "text-amber-400",
        bgColor: "bg-amber-900/20",
        icon: <Shield className="h-6 w-6 text-amber-400" />,
      };
    if (score < 750)
      return {
        text: "Very Good",
        color: "text-emerald-400",
        bgColor: "bg-emerald-900/20",
        icon: <Award className="h-6 w-6 text-emerald-400" />,
      };
    return {
      text: "Excellent",
      color: "text-indigo-400",
      bgColor: "bg-indigo-900/20",
      icon: <Star className="h-6 w-6 text-indigo-400" />,
    };
  };

  const creditStatus = getCreditScoreStatus(user.creditScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header with glass effect */}
        <div className="backdrop-blur-lg bg-slate-800/40 rounded-3xl p-8 mb-12 border border-slate-700/50 shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Service Catalog
          </h1>
          <p className="text-slate-300 text-lg">
            Discover next-generation financial services tailored to your profile
          </p>
        </div>

        {/* Credit Score Banner with glow effect */}
        <div className="relative bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-10 overflow-hidden border border-slate-700/50">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex items-center mb-6 md:mb-0">
              <div
                className={`w-20 h-20 ${creditStatus.bgColor} rounded-2xl flex items-center justify-center mr-6 border border-slate-700/50 shadow-lg`}
              >
                <div className="flex flex-col items-center">
                  {creditStatus.icon}
                  <span
                    className={`text-2xl font-bold ${creditStatus.color} mt-1`}
                  >
                    {user.creditScore || 0}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 mb-1 text-sm uppercase tracking-wider">
                  Credit Score Status
                </p>
                <p className={`text-2xl font-bold ${creditStatus.color}`}>
                  {creditStatus.text}
                </p>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-amber-500 to-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, user.creditScore / 9)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-300 mb-3">
                Higher score unlocks exclusive premium services
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-900/30">
                Upgrade Your Score
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter with pill design */}
        <div className="flex flex-wrap items-center gap-3 mb-10 bg-slate-800/30 p-2 rounded-2xl backdrop-blur-sm">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/70"
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category.id)}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid with glass morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20 hover:translate-y-[-4px] group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-3xl p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      {service.icon}
                    </div>
                    {service.free ? (
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full border border-emerald-600/30">
                        Free
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-900/30 text-indigo-400 text-xs font-medium rounded-full border border-indigo-600/30">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    {service.description}
                  </p>

                  {service.minCreditScore > 0 && (
                    <div className="mb-4 text-xs text-slate-400 flex items-center">
                      <span>Min. Credit Score: </span>
                      <span
                        className={`font-semibold ml-1 ${
                          user.creditScore >= service.minCreditScore + 50
                            ? "text-emerald-400"
                            : "text-slate-200"
                        }`}
                      >
                        {service.minCreditScore}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700/50">
                    {!service.free && (
                      <span className="text-indigo-400 font-medium">
                        {service.price}
                      </span>
                    )}
                    <button
                      className={`px-5 py-2 rounded-xl text-sm font-medium flex items-center ${
                        service.free
                          ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/40 border border-emerald-700/30"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/20"
                      } transition-all duration-300 ml-auto group-hover:shadow-lg`}
                    >
                      {service.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-16 text-center bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-700/50 p-10">
              <div className="text-5xl mb-6 mx-auto bg-slate-700/30 p-6 rounded-full w-24 h-24 flex items-center justify-center">
                🔍
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Services Available
              </h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                Improve your credit score to unlock more premium services and
                exclusive offers
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-900/30">
                Learn How to Improve
              </button>
            </div>
          )}
        </div>

        {/* Credit Score Upgrade Banner with futuristic design */}
        <div className="mt-16 relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Abstract background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAxMmM2LjYyNyAwIDEyLTUuMzczIDEyLTEycy01LjM3My0xMi0xMi0xMi0xMiA1LjM3My0xMiAxMiA1LjM3MyAxMiAxMiAxMnptMjQgMThjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6bTAgMTJjNi42MjcgMCAxMi01LjM3MyAxMi0xMnMtNS4zNzMtMTItMTItMTItMTIgNS4zNzMtMTIgMTIgNS4zNzMgMTIgMTIgMTJ6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

          <div className="relative p-10 md:p-12 flex flex-col md:flex-row items-center z-10">
            <div className="flex-1 text-white mb-8 md:mb-0">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-100 mb-4">
                PREMIUM ACCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Unlock Premium Financial Services
              </h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-lg">
                Elevate your financial journey with premium services designed
                for success. Improve your credit score and gain exclusive access
                to personalized financial solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Get Premium Coaching
                </button>
                <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-80"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full flex items-center justify-center">
                  <div className="z-10 text-white text-center">
                    <Zap className="h-12 w-12 mx-auto" />
                    <div className="mt-2 font-bold text-lg">Premium Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceCatalogs;
