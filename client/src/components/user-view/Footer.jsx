import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-700/30 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-900/50">
              C
            </div>
            <span className="text-slate-400">
              © 2025 CreditBoost. All rights reserved.
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;