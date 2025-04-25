import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ServicesDropdown from "./ServicesDropdown";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const NavLinks = [
    { name: "Bussiness", path: "/services/b2b-systems" },
    { name: "About Us", path: "/aboutus" },
    { name: "Careers", path: "/careers" },
  ];

  const handleLogout = () => {
    // Clear user data from localStorage
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // setUser(null);
    logout();
    // Close any open dropdowns
    setProfileDropdownOpen(false);
    // Navigate to home page
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
    setSignupDropdownOpen(false);
    setLoginDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ")[0][0].toUpperCase();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block">
              <img src="/logo2.png" alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ServicesDropdown />

            {NavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-gray-200 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Show either login/signup buttons or user profile */}
            {!user ? (
              <>
                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    Login
                  </button>

                  {loginDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white text-blue-600 rounded-md shadow-lg w-48 z-50">
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Customer Login
                      </button>
                      <button
                        onClick={() => handleNavigation("/LoginAgent")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Agent Login
                      </button>
                    </div>
                  )}
                </div>

                {/* Sign Up Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSignupDropdownOpen(!signupDropdownOpen)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    Sign Up
                  </button>

                  {signupDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white text-blue-600 rounded-md shadow-lg w-48 z-50">
                      <button
                        onClick={() => handleNavigation("/signup")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Customer Signup
                      </button>
                      <button
                        onClick={() => handleNavigation("/B2BSignup")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Agent Signup
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
                    {getInitials(user.name)}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <Link
                        to="/my-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/refer-earn"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Refer & Earn
                      </Link>
                      <Link
                        to="/reedem"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Redeem Voucher
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
              className="focus:outline-none focus:ring-2 focus:ring-white"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-blue-700 z-40 md:hidden">
          <div className="px-4 pt-24 pb-8 space-y-6 flex flex-col items-center h-full">
            <ServicesDropdown />

            {NavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className="text-2xl hover:text-gray-200 transition-colors duration-300"
              >
                {link.name}
              </button>
            ))}

            {/* Mobile User Profile or Login/Signup */}
            {user ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-semibold">
                  {getInitials(user.name)}
                </div>
                <p className="text-xl font-medium">{user.name}</p>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Login Buttons */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/LoginAgent")}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100"
                  >
                    Agent Login
                  </button>
                </div>

                {/* Mobile Signup Buttons */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100"
                  >
                    Customer Signup
                  </button>
                  <button
                    onClick={() => handleNavigation("/B2BSignup")}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg text-xl font-semibold hover:bg-gray-100"
                  >
                    Agent Signup
                  </button>
                </div>
              </>
            )}

            {/* Close Menu Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-200"
              aria-label="Close menu"
            >
              <FiX size={32} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
