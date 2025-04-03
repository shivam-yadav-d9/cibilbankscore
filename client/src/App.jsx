import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout & Auth Components
import Layout from "./pages/auth/Layout";
import Login from "./pages/auth/Login";
import Signup from './pages/auth/Register';
import UserInput from "./pages/auth/UserInput";
import AdminLogin from "./components/admin-view/AdminLogin";
import BusinessLogin from "./components/business-view/auth/BusinessLogin";

// User View Components
import Dashboard from "./components/user-view/Dashboard";
import LoanInformation from "./components/user-view/LoanInformation";
import AboutUs from "./components/user-view/AboutUs";
import CareerPage from "./components/user-view/CareerPage";
import CreditCheck from './components/user-view/CreditCheck';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  
  const updateAuth = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login onLoginSuccess={updateAuth} />} />
            <Route path="signup" element={<Signup />} />
            <Route path="user-input" element={<UserInput />} />
            <Route path="admin-login" element={<AdminLogin onLoginSuccess={updateAuth} />} />
            <Route path="business-login" element={<BusinessLogin onLoginSuccess={updateAuth} />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="careers" element={<CareerPage />} />
            
            {/* Service Information Pages */}
            <Route path="banking-api" element={<BankingAPIPage />} />
            <Route path="b2b-banking" element={<B2BBankingSystems />} />
            <Route path="loan-services" element={<LoanServicesPage />} />
            <Route path="credit-solutions" element={<CreditBuildingSolutions />} />
            <Route path="atm-installation" element={<ATMInstallationPage />} />
          </Route>
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/credit-check" element={
            <ProtectedRoute>
              <CreditCheck />
            </ProtectedRoute>
          } />
          
          <Route path="/loan-information" element={
            <ProtectedRoute>
              <LoanInformation />
            </ProtectedRoute>
          } />
          
          <Route path="/investment" element={
            <ProtectedRoute>
              <InvestmentDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          {/* Business Routes */}
          <Route path="/b2b-dashboard" element={
            <ProtectedRoute businessOnly={true}>
              <B2BDashboard />
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Enhanced Protected Route component
function ProtectedRoute({ children, adminOnly = false, businessOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  if (businessOnly && user?.role !== 'business') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

export default App;