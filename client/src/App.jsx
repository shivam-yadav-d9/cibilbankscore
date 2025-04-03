import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Layout from "./pages/auth/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserInput from "./pages/auth/UserInput";
import Dashboard from "./components/user-view/Dashboard";
import CreditDashboard from "./components/user-view/CreditDashboard";

import AdminPanel from "./components/admin-view/AdminPanel";
import LoanInformation from "./components/user-view/LoanInformation";
import AdminLogin from "./components/admin-view/AdminLogin";
import B2BDashboard from "./components/business-view/B2BDashboard";
import Home from "./pages/auth/Home";
import AboutUs from "./components/user-view/AboutUs";
import CareerPage from "./components/user-view/CareerPage";
import BankingAPIPage from "./pages/auth/BankingAPIPage";
import B2BBankingSystems from "./pages/auth/B2BBankingSystems";
import LoanServicesPage from "./pages/auth/LoanServicesPage";
import CreditBuildingSolutions from "./pages/auth/CreditBuildingSolutions";
import ATMInstallationPage from "./pages/auth/ATMInstallationPage";
import InvestmentDashboard from "./pages/auth/InvestmentDashboard";
import BusinessLogin from "./components/business-view/auth/BusinessLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const updateAuth = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  };

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/services/banking-apis" element={<BankingAPIPage />} />
          <Route path="/services/b2b-systems" element={<B2BBankingSystems />} />
          <Route path="/services/digital-payments" element={<LoanServicesPage />} />
          <Route path="/services/credit-building" element={<CreditBuildingSolutions />} />
          <Route path="/services/atm" element={<ATMInstallationPage />} />
          <Route path="/services/investment-and-wealth-management" element={<InvestmentDashboard />} />


          <Route path="/login" element={<Login updateAuth={updateAuth} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/userinput" element={<UserInput />} />
          <Route path="/loan" element={<LoanInformation />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/business-login" element={<BusinessLogin updateAuth={updateAuth} />} />
          
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard updateAuth={updateAuth} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/admin-login" />} />
          <Route path="/business-dashboard" element={isAuthenticated ? <B2BDashboard /> : <Navigate to="/business-login" />} />

          <Route path="*" element={<h1 className="text-center text-white mt-10">404 - Page Not Found</h1>} />
        </Route>
        <Route path="/CreditDashboard" element={<CreditDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
