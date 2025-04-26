import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ServicesDropdown from "./ServicesDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const NavLinks = [
    { name: "Business", path: "/services/b2b-systems" },
    { name: "About Us", path: "/aboutus" },
    { name: "Careers", path: "/careers" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ")[0][0].toUpperCase();
  };

  return (
    <nav 
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled 
          ? "bg-opacity-95 backdrop-blur-md bg-blue-900" 
          : "bg-indigo-900 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block">
              <img 
                src="/logo2.png" 
                alt="Logo" 
                className="h-12 w-auto filter drop-shadow-lg" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="group relative">
              <button className="text-white hover:text-blue-200 transition-colors duration-300 group-hover:text-blue-200">
                Services
              </button>
              <div className="absolute hidden group-hover:block top-full left-0 bg-blue-900 bg-opacity-90 backdrop-blur-md rounded-lg shadow-2xl p-4 w-64 mt-2 transition-all duration-300 border border-blue-500">
                <ServicesDropdown />
              </div>
            </div>

            {NavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white hover:text-blue-200 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-300 after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}

            {/* Show either login/signup buttons or user profile */}
            {!user ? (
              <div className="flex items-center space-x-4">
                {/* Login Button */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("login")}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 border border-blue-500 shadow-md hover:shadow-blue-500/50"
                  >
                    Login
                  </button>

                  {activeDropdown === "login" && (
                    <div className="absolute top-full mt-2 right-0 bg-blue-900 bg-opacity-90 backdrop-blur-md rounded-lg shadow-2xl border border-blue-500 w-48 z-50 overflow-hidden">
                      <div className="p-1">
                        <button
                          onClick={() => handleNavigation("/login")}
                          className="block w-full text-left px-4 py-3 text-white hover:bg-blue-700 rounded transition-colors duration-200"
                        >
                          Customer Login
                        </button>
                        <button
                          onClick={() => handleNavigation("/LoginAgent")}
                          className="block w-full text-left px-4 py-3 text-white hover:bg-blue-700 rounded transition-colors duration-200"
                        >
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/50"
                  >
                    Sign Up
                  </button>

                  {activeDropdown === "signup" && (
                    <div className="absolute top-full mt-2 right-0 bg-blue-900 bg-opacity-90 backdrop-blur-md rounded-lg shadow-2xl border border-blue-500 w-48 z-50 overflow-hidden">
                      <div className="p-1">
                        <button
                          onClick={() => handleNavigation("/signup")}
                          className="block w-full text-left px-4 py-3 text-white hover:bg-blue-700 rounded transition-colors duration-200"
                        >
                          Customer Signup
                        </button>
                        <button
                          onClick={() => handleNavigation("/B2BSignup")}
                          className="block w-full text-left px-4 py-3 text-white hover:bg-blue-700 rounded transition-colors duration-200"
                        >
                          Agent Signup
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* User Profile */
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("profile")}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="User profile"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md relative overflow-hidden border-2 border-blue-300">
                    <span className="relative z-10">{getInitials(user.name)}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-80 animate-pulse"></div>
                  </div>
                </button>

                {activeDropdown === "profile" && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-2xl bg-blue-900 bg-opacity-90 backdrop-blur-md border border-blue-500 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-blue-700">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-blue-200 text-xs">{user.email}</p>
                      </div>
                      <Link
                        to="/my-profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/refer-earn"
                        className="block px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Refer & Earn
                      </Link>
                      <Link
                        to="/reedem"
                        className="block px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Redeem Voucher
                      </Link>
                      <Link
                        to="/payment-history"
                        className="block px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Payment History
                      </Link>
                      <Link
                        to="/wallet"
                        className="block px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Wallet
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-blue-700 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus:outline-none text-white"
            >
              <div className="w-8 flex flex-col items-end space-y-1.5">
                <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'w-8 transform rotate-45 translate-y-2' : 'w-8'}`}></span>
                <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-6'}`}></span>
                <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'w-8 transform -rotate-45 -translate-y-2' : 'w-4'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-95 backdrop-blur-md z-40 md:hidden">
          <div className="px-4 pt-24 pb-8 space-y-8 flex flex-col items-center h-full">
            <div className="text-xl font-medium text-white mb-6">Services</div>
            <ServicesDropdown />

            {NavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className="text-xl text-white hover:text-blue-200 transition-colors duration-300"
              >
                {link.name}
              </button>
            ))}

            {/* Mobile User Profile or Login/Signup */}
            {user ? (
              <div className="flex flex-col items-center space-y-6 mt-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-3xl text-white font-semibold relative overflow-hidden">
                  <span className="relative z-10">{getInitials(user.name)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-80 animate-pulse"></div>
                </div>
                <p className="text-xl font-medium text-white">{user.name}</p>
                
                <div className="flex flex-col space-y-3 w-full max-w-xs">
                  <Link to="/my-profile" className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-center">
                    My Profile
                  </Link>
                  <Link to="/wallet" className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-center">
                    Wallet
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-center"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 mt-6">
                <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-center"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/LoginAgent")}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-center"
                  >
                    Agent Login
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg text-center"
                  >
                    Customer Signup
                  </button>
                  <button
                    onClick={() => handleNavigation("/B2BSignup")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg text-center"
                  >
                    Agent Signup
                  </button>
                </div>
              </div>
            )}

            {/* Close Menu Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-200"
              aria-label="Close menu"
            >
              <div className="w-8 flex flex-col items-end space-y-1.5">
                <span className="block h-0.5 w-8 bg-white rounded transform rotate-45"></span>
                <span className="block h-0.5 w-8 bg-white rounded transform -rotate-45 -translate-y-2"></span>
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}