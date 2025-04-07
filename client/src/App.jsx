import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./pages/auth/Navbar";

// Layout & Auth Components
import Layout from "./pages/auth/Layout";

import UserInput from "./pages/auth/UserInput";
import AdminLogin from "./components/admin-view/AdminLogin";
import BusinessLogin from "./components/business-view/auth/BusinessLogin";

// User View Components
import Dashboard from "./components/user-view/Dashboard";
import LoanInformation from "./components/user-view/LoanInformation";
import AboutUs from "./components/user-view/AboutUs";
import CareerPage from "./components/user-view/CareerPage";
import CreditCheck from "./components/user-view/CreditCheck";

// Admin & Business Components
import AdminPanel from "./components/admin-view/AdminPanel";
import B2BDashboard from "./components/business-view/B2BDashboard";

// Service Pages
import Home from "./pages/auth/Home";
import BankingAPIPage from "./pages/auth/BankingAPIPage";
import B2BBankingSystems from "./pages/auth/B2BBankingSystems";
import LoanServicesPage from "./pages/auth/LoanServicesPage";
import CreditBuildingSolutions from "./pages/auth/CreditBuildingSolutions";
import ATMInstallationPage from "./pages/auth/ATMInstallationPage";
import InvestmentDashboard from "./pages/auth/InvestmentDashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import UserLoanpage from "./pages/auth/UserLoanpage";
import UserLoanInput from "./pages/auth/UserLoanInput";
import LoanProcessor from "./components/user-view/LoanProcessor";

function App() {
  const { isAuthenticated, loading, updateAuth } = useAuth();

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route element={<Layout />}>
              {/* Main routes */}
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/careers" element={<CareerPage />} />

              {/* Service routes */}
              <Route
                path="/services/banking-apis"
                element={<BankingAPIPage />}
              />
              <Route
                path="/services/b2b-systems"
                element={<B2BBankingSystems />}
              />
              <Route
                path="/services/digital-payments"
                element={<LoanServicesPage />}
              />
              <Route
                path="/services/credit-building"
                element={<CreditBuildingSolutions />}
              />
              <Route path="/services/atm" element={<ATMInstallationPage />} />
              <Route
                path="/services/investment-and-wealth-management"
                element={<InvestmentDashboard />}
              />

              {/* Auth routes */}
              <Route
                path="/login"
                element={<Login updateAuth={updateAuth} />}
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/userinput" element={<UserInput />} />

              {/* Special login routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/business-login"
                element={<BusinessLogin updateAuth={updateAuth} />}
              />
{/* 
              <Route path="/UserLoanpage" element={<UserLoanpage />} /> */}
              <Route path="/UserLoanpage" element={<LoanProcessor />} />
              <Route path="/UserLoanInput" element={<UserLoanInput />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard updateAuth={updateAuth} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/credit-check"
                element={
                  <ProtectedRoute>
                    <CreditCheck />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/loan"
                element={
                  <ProtectedRoute>
                    <LoanInformation />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/business-dashboard"
                element={
                  <ProtectedRoute businessOnly={true}>
                    <B2BDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <h1 className="text-center text-white mt-10">
                    404 - Page Not Found
                  </h1>
                }
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Enhanced Protected Route component
function ProtectedRoute({ children, adminOnly = false, businessOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  if (businessOnly && user?.role !== "business") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default App;
