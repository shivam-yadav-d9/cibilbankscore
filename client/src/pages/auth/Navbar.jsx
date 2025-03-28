import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ServicesDropdown from "./ServicesDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NavLinks = [
    { name: "Mission", path: "#mission" },
    { name: "About Us", path: "/aboutus" },
    { name: "Careers", path: "/careers" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block">
              <img 
                src="/logo2.png" 
                alt="Logo" 
                className="h-12 w-auto" 
              />
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
            
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Sign Up
            </button>
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
            
            <button
              onClick={() => handleNavigation("/signup")}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Sign Up
            </button>

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