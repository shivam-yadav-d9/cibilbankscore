import React from "react";
import NotificationBell from "./NotificationBell";

const Header = ({ user, handleLogout }) => {
  return (
    <header className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm border-b border-slate-700/30 sticky top-0 z-10 shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-900/50">
              C
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
              CreditBoost
            </h1>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-6">
            <NotificationBell />
            {/* User greeting - visible on medium screens and up */}
            <div className="hidden md:flex items-center">
              <span className="text-slate-400 mr-1">Welcome,</span>
              <span className="font-semibold text-slate-200">{user.name}</span>
            </div>

            {/* User Avatar */}
            <div className="relative group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 hover:shadow-indigo-900/50">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center space-x-2 group"
            >
              <span className="hidden sm:inline text-sm font-medium group-hover:text-indigo-400">
                Logout
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
