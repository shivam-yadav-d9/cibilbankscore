import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This will render the current route */}
      <Footer />
    </>
  );
}

export default Layout;
