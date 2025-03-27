import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FiMenu, FiX } from "react-icons/fi";
import ServicesDropdown from "./ServicesDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate function

  return (
    <nav className="bg-blue-600 text-white shadow-md ">
      <div className="max-w-7xl h-[80px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block">
              <img src="/logo2.png" alt="Logo" className="h-15" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="md:flex space-x-6 flex items-center">
            <ServicesDropdown />

            <a href="#" className="hover:text-gray-200">
              Mission
            </a>

            <Link to={"/aboutus"} className="hover:text-gray-200">
              About us
            </Link>

            <Link to={"/careers"} className="hover:text-gray-200">
              Careers
            </Link>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              SignUp
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 p-4 space-y-4 flex flex-col items-center">
          <a href="#" className="block hover:text-gray-200">
            Home
          </a>
          <a href="#" className="block hover:text-gray-200">
            About
          </a>
          <a href="#" className="block hover:text-gray-200">
            Services
          </a>
          <a href="#" className="block hover:text-gray-200">
            Contact
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/signup");
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-center font-semibold hover:bg-gray-200"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
