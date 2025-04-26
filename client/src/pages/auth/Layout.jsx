import React from 'react';
import Navbar from './Navbar';
import Footer from "./Footer"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20"> {/* Add padding top to account for fixed navbar */}
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;