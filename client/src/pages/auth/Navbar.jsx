import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import ServicesDropdown from "./ServicesDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // NavLinks will only show for non-logged in users
  const NavLinks = [
    { name: "Business", path: "/services/b2b-systems", icon: "far fa-building" },
    { name: "About Us", path: "/aboutus", icon: "far fa-address-card" },
    { name: "Careers", path: "/careers", icon: "far fa-briefcase" },
  ];

  // Handle scroll effect with throttling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(lastScrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setActiveDropdown(null);
    navigate("/"); 
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Fixed getInitials function
const getInitials = (name) => {
  if (!name) return "";
  
  const nameParts = name.trim().split(" ").filter(part => part.length > 0);
  
  if (nameParts.length === 0) return "";
  
  if (nameParts.length === 1) {
    // Single name: take first two characters if available, otherwise just first character
    const singleName = nameParts[0];
    return singleName.length >= 2 
      ? singleName.substring(0, 2).toUpperCase()
      : singleName[0].toUpperCase();
  }
  
  // Multiple names: take first character of first and last name
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
};

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled
          ? "bg-gradient-to-r from-blue-950 to-indigo-950 bg-opacity-85 backdrop-blur-lg shadow-lg shadow-blue-900/20 h-16"
          : "bg-gradient-to-r from-blue-900 to-indigo-900 h-20"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/logo2.png"
                alt="Logo"
                className={`transition-all duration-500 ${scrolled ? 'h-8' : 'h-12'} w-auto filter drop-shadow-lg`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Content based on user login status */}
            {!user ? (
              // Logged out view
              <>
                {/* Services Dropdown */}
                <div className="group relative">
                  <button className="text-white group-hover:text-blue-200 transition-colors duration-300 flex items-center font-medium">
                    <span className="relative z-10">Services</span>
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <div className="absolute hidden group-hover:block top-full left-0 bg-gradient-to-b from-blue-900 to-indigo-900 bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl p-4 w-72 mt-2 transition-all duration-300 border border-blue-700/30 transform origin-top scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                    <div className="p-2">
                      <ServicesDropdown />
                    </div>
                  </div>
                </div>

                {/* NavLinks */}
                {NavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-white hover:text-blue-200 transition-colors duration-300 relative font-medium flex items-center ${isActive(link.path) ? 'text-blue-200' : ''}`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0'}`}></span>
                  </Link>
                ))}

                {/* Login and Signup Buttons */}
                <div className="flex items-center space-x-4" ref={dropdownRef}>
                  {/* Login Button */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("login")}
                      className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-blue-600/30 shadow-md hover:shadow-blue-500/30 flex items-center space-x-2"
                    >
                      <span>Login</span>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "login" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {activeDropdown === "login" && (
                      <div className="absolute top-full mt-2 right-0 bg-gradient-to-b from-blue-900 to-indigo-900 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-blue-700/30 w-52 z-50 overflow-hidden transform origin-top animate-dropdown">
                        <div className="p-1">
                          <button
                            onClick={() => handleNavigation("/login")}
                            className="w-full text-left px-4 py-3 text-white hover:bg-blue-700/50 rounded transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Customer Login
                          </button>
                          <button
                            onClick={() => handleNavigation("/LoginAgent")}
                            className="w-full text-left px-4 py-3 text-white hover:bg-blue-700/50 rounded transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Agent Login
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sign Up Button */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("signup")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/30 flex items-center space-x-2 border border-indigo-500/30"
                    >
                      <span>Sign Up</span>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "signup" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {activeDropdown === "signup" && (
                      <div className="absolute top-full mt-2 right-0 bg-gradient-to-b from-blue-900 to-indigo-900 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-blue-700/30 w-52 z-50 overflow-hidden transform origin-top animate-dropdown">
                        <div className="p-1">
                          <button
                            onClick={() => handleNavigation("/signup")}
                            className="w-full text-left px-4 py-3 text-white hover:bg-blue-700/50 rounded transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            Customer Signup
                          </button>
                          <button
                            onClick={() => handleNavigation("/B2BSignup")}
                            className="w-full text-left px-4 py-3 text-white hover:bg-blue-700/50 rounded transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            Agent Signup
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Logged in view
              <>
                <Link
                  to="/dashboard"
                  className={`text-white hover:text-blue-200 transition-colors duration-300 relative font-medium flex items-center ${isActive("/dashboard") ? 'text-blue-200' : ''}`}
                >
                  <span className="relative z-10">Dashboard</span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${isActive("/dashboard") ? 'w-full' : 'w-0'}`}></span>
                </Link>
                <Link
                  to="/wallet" // Assuming Add Funds also goes to the wallet page
                  className={`text-white hover:text-blue-200 transition-colors duration-300 relative font-medium flex items-center ${isActive("/wallet") ? 'text-blue-200' : ''}`}
                >
                  <span className="relative z-10">Add Funds</span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${isActive("/wallet") ? 'w-full' : 'w-0'}`}></span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleDropdown("profile")}
                    className="flex items-center space-x-3 focus:outline-none group"
                    aria-label="User profile"
                  >
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-white text-sm font-medium">Welcome back</span>
                      <span className="text-blue-200 text-xs">{user.name}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md relative overflow-hidden border-2 border-blue-400 group-hover:border-blue-300 transition-all duration-300">
                      <span className="relative z-10">{getInitials(user.name)}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <svg className={`w-4 h-4 text-blue-200 transition-transform duration-300 ml-1 ${activeDropdown === "profile" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {activeDropdown === "profile" && (
                    <div className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl bg-gradient-to-b from-blue-900 to-indigo-900 bg-opacity-95 backdrop-blur-md border border-blue-700/30 overflow-hidden transform origin-top animate-dropdown">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-blue-700/50 flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                            <span className="relative z-10">{getInitials(user.name)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-blue-200 text-xs">{user.email}</p>
                          </div>
                        </div>

                        {/* User Menu Links (excluding Dashboard and Wallet/Add Funds which are now outside) */}
                        <Link
                          to="/my-profile"
                          className="px-4 py-2 text-sm text-white hover:bg-blue-700/50 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          My Profile
                        </Link>
                        <Link
                          to="/refer-earn"
                          className="px-4 py-2 text-sm text-white hover:bg-blue-700/50 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          Refer & Earn
                        </Link>
                        <Link
                          to="/reedem"
                          className="px-4 py-2 text-sm text-white hover:bg-blue-700/50 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                          </svg>
                          Redeem Voucher
                        </Link>
                        <Link
                          to="/MyApplication"
                          className="px-4 py-2 text-sm text-white hover:bg-blue-700/50 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          My Application
                        </Link>

                        <div className="border-t border-blue-700/50 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-blue-700/50 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Theme Toggle Button - Moved outside conditional for consistency */}
            <button
              onClick={toggleTheme}
              className="relative group p-2 rounded-lg bg-blue-800/40 hover:bg-blue-700/60 transition-all duration-300 focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-300 transform transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-200 transform transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus:outline-none text-white group"
            >
              <div className="w-8 flex flex-col items-end space-y-1.5">
                <span className={`block h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded transition-all duration-300 ${menuOpen ? 'w-8 transform rotate-45 translate-y-2' : 'w-8 group-hover:w-6'}`}></span>
                <span className={`block h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-6 group-hover:w-8'}`}></span>
                <span className={`block h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded transition-all duration-300 ${menuOpen ? 'w-8 transform -rotate-45 -translate-y-2' : 'w-4 group-hover:w-6'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-950 bg-opacity-98 backdrop-blur-md z-40 lg:hidden">
          <div className="px-4 pt-24 pb-8 flex flex-col h-full overflow-y-auto">
            {/* Theme Toggle - Mobile */}
            <div className="mb-8 px-4">
              <button
                onClick={toggleTheme}
                className="w-full bg-blue-800/30 border border-blue-700/30 rounded-lg py-3 px-4 text-white flex items-center justify-between group hover:bg-blue-700/40 transition-all duration-300"
              >
                <div className="flex items-center">
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span className="text-lg">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                <div className="w-12 h-6 bg-blue-900/50 rounded-full p-1 duration-300 ease-in-out">
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-6 bg-yellow-300' : ''}`} />
                </div>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-8 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-blue-800/30 border border-blue-700/30 rounded-lg py-3 px-4 pl-10 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-blue-300 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            {/* Only show services section and NavLinks if user is not logged in */}
            {!user && (
              <>
                <div className="text-lg font-medium text-white mb-4 px-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Our Services
                </div>

                {/* Mobile Services Menu */}
                <div className="mb-6 bg-blue-800/20 rounded-xl border border-blue-700/30 overflow-hidden">
                  <div className="px-4 py-3">
                    <ServicesDropdown />
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="mb-8">
                  <ul className="space-y-2">
                    {NavLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center px-4 py-3 rounded-lg ${isActive(link.path)
                              ? "bg-blue-600/40 text-white"
                              : "text-blue-100 hover:bg-blue-800/30"
                            } transition-colors duration-200`}
                          onClick={() => setMenuOpen(false)}
                        >
                          <i className={`${link.icon} w-5 h-5 mr-3`}></i>
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}


            {/* User or Auth Section */}
            <div className="mt-auto px-4">
              {user ? (
                <div className="space-y-4">
                  {/* Dashboard and Add Funds links for mobile */}
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 rounded-lg ${isActive("/dashboard") ? "bg-blue-600/40 text-white" : "text-blue-100 hover:bg-blue-800/30"} transition-colors duration-200`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-2 2v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6m3-3h.01\"></path></svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/wallet" // Assuming Add Funds also goes to the wallet page
                    className={`flex items-center px-4 py-3 rounded-lg ${isActive("/wallet") ? "bg-blue-600/40 text-white" : "text-blue-100 hover:bg-blue-800/30"} transition-colors duration-200`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z\"></path></svg>
                    Add Funds
                  </Link>

                  {/* User Profile Section */}
                  <div className="bg-blue-800/30 border border-blue-700/30 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold shadow-md relative overflow-hidden border-2 border-blue-400">
                        <span className="relative z-10">{getInitials(user.name)}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80"></div>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-white text-lg">{user.name}</p>
                        <p className="text-blue-200 text-sm">{user.email}</p>
                      </div>
                    </div>

                    {/* User Menu Links */}
                    <div className="space-y-2">
                      <Link
                        to="/my-profile"
                        className="flex items-center py-2 text-blue-100 hover:text-white transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/refer-earn"
                        className="flex items-center py-2 text-blue-100 hover:text-white transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        Refer & Earn
                      </Link>
                      <Link
                        to="/reedem"
                        className="flex items-center py-2 text-blue-100 hover:text-white transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                        Redeem Voucher
                      </Link>
                      <Link
                        to="/MyApplication"
                        className="flex items-center py-2 text-blue-100 hover:text-white transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        MyApplication
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full mt-4 flex items-center justify-center py-3 bg-red-600/30 hover:bg-red-600/50 text-red-100 rounded-lg transition-colors duration-200 border border-red-500/30"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Login Button */}
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full bg-blue-800/40 hover:bg-blue-800/60 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-blue-700/30 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Customer Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/LoginAgent")}
                    className="w-full bg-blue-800/40 hover:bg-blue-800/60 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-blue-700/30 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Agent Login
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-blue-700/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-blue-300 text-sm">OR</span>
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/30 border border-indigo-500/30 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Create an account
                  </button>
                  <button
                    onClick={() => handleNavigation("/B2BSignup")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-indigo-500/30 border border-purple-500/30 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Agent Sign up
                  </button>
                </div>
              )}
            </div>


            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-blue-800/40 hover:bg-blue-700/60 text-white transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}