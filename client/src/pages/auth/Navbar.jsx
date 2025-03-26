import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md ">
      <div className="max-w-7xl h-[80px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/logo2.png" alt="Logo" className="h-15" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 flex items-center ">
            <a href="#" className="hover:text-gray-200">Home</a>
            <a href="#" className="hover:text-gray-200">About</a>
            <a href="#" className="hover:text-gray-200">Services</a>
            <a href="#" className="hover:text-gray-200">Contact</a>
            <a href="#" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
              Get Started
            </a>
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
        <div className="md:hidden bg-blue-700 p-4 space-y-4 flex items-center">
          <a href="#" className="block hover:text-gray-200">Home</a>
          <a href="#" className="block hover:text-gray-200">About</a>
          <a href="#" className="block hover:text-gray-200">Services</a>
          <a href="#" className="block hover:text-gray-200">Contact</a>
          <a href="#" className="block bg-white text-blue-600 px-4 py-2 rounded-lg text-center font-semibold hover:bg-gray-200">
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
