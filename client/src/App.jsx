import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout
import Layout from "./pages/auth/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import UserInput from "./pages/auth/UserInput";

// Home & Service Pages
import Home from "./pages/auth/Home";
import AboutUs from "./components/user-view/AboutUs";
import CareerPage from "./components/user-view/CareerPage";
import BankingAPIPage from "./pages/auth/BankingAPIPage";
import B2BBankingSystems from "./pages/auth/B2BBankingSystems";
import LoanServicesPage from "./pages/auth/LoanServicesPage";
import CreditBuildingSolutions from "./pages/auth/CreditBuildingSolutions";
import ATMInstallationPage from "./pages/auth/ATMInstallationPage";
import InvestmentDashboard from "./pages/auth/InvestmentDashboard";

// User Views
import Dashboard from "./components/user-view/Dashboard";
import CreditCheck from "./components/user-view/CreditCheck";
import LoanInformation from "./components/user-view/LoanInformation";
import LoanProcessor from "./components/user-view/LoanProcessor";
import UserLoanInput from "./pages/auth/UserLoanInput";
import UserLoanpage from "./pages/auth/UserLoanPage";


// Admin & Business Views
import AdminLogin from "./components/admin-view/AdminLogin";
import AdminPanel from "./components/admin-view/AdminPanel";
import BusinessLogin from "./components/business-view/auth/BusinessLogin";
import B2BDashboard from "./components/business-view/B2BDashboard";

import UserBasicData from "./pages/auth/UserBasicData";
import UserAddress from "./pages/auth/UserAddress";
import UserSecondAddress from "./pages/auth/UserSecondAddress";
import UserCoApplications from "./pages/auth/UserCoApplications";
import UserSaveRefrences from "./pages/auth/UserSaveRefrences";
import UserPreviousData from "./pages/auth/UserPreviousData";
import TermsAndConditions from "./components/business-view/B2bServicesActivate";
import B2BSignup from "./pages/auth/B2BSignup";
import LoginAgent from "./pages/auth/LoginAgent";


function App() {
  const { isAuthenticated, loading, updateAuth } = useAuth();

  return (
    <Router>

          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/careers" element={<CareerPage />} />
              <Route path="/login" element={<Login updateAuth={updateAuth} />} />
              
              <Route path="/LoginAgent" element={<LoginAgent/>}/>
              <Route path="/signup" element={<Signup />} />
              <Route path="/userinput" element={<UserInput />} />

              <Route path="/B2BSignup" element={<B2BSignup/>}/>
              {/* <Route path="/UserLoanInput" element={<UserLoanInput />} /> */}

              {/* Service Pages */}
              <Route path="/services/banking-apis" element={<BankingAPIPage />} />
              <Route path="/services/b2b-systems" element={<B2BBankingSystems />} />
              <Route path="/services/digital-payments" element={<LoanServicesPage />} />
              <Route path="/services/credit-building" element={<CreditBuildingSolutions />} />
              <Route path="/services/atm" element={<ATMInstallationPage />} />
              <Route path="/services/investment-and-wealth-management" element={<InvestmentDashboard />} />

              {/* Admin & Business Auth */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/business-login" element={<BusinessLogin updateAuth={updateAuth} />} />


              {/* 🔒 Protected User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard updateAuth={updateAuth} /></ProtectedRoute>} />
              <Route path="/credit-check" element={<ProtectedRoute><CreditCheck /></ProtectedRoute>} />
              <Route path="/loan" element={<ProtectedRoute><LoanInformation /></ProtectedRoute>} />
              <Route path="/UserLoanInput" element={<ProtectedRoute><LoanProcessor /></ProtectedRoute>} />
              <Route path="/UserLoanpage" element={<ProtectedRoute><UserLoanpage /></ProtectedRoute>} />

              <Route path="/UserBasicData" element={<UserBasicData />} />
              <Route path="/UserAddress" element={<UserAddress />} />
              <Route path="/UserSecondAddress" element={<UserSecondAddress />} />
              <Route path="/UserCoApplications" element={<UserCoApplications />} />
              <Route path="/UserSaveRefrences" element={<UserSaveRefrences/>} />
              <Route path="/UserPreviousData" element={<UserPreviousData/>}/>

              {/* Protected Admin Route */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

              {/* 🏢 Protected Business Route */}
              <Route path="/business-dashboard" element={<B2BDashboard />} />
              <Route path="/TermsAndConditions" element={<TermsAndConditions/>}/>

              {/* Catch-All Route */}
              <Route path="*" element={<h1 className="text-center text-white mt-10">404 - Page Not Found</h1>} />

            </Route>
          </Routes>
       
    </Router>
  );
}

function ProtectedRoute({ children, adminOnly = false, businessOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (adminOnly && user?.role !== "admin") return <Navigate to="/dashboard" />;

  if (businessOnly && user?.role !== "business")
    return <Navigate to="/dashboard" />;

  return children;
}

export default App;
