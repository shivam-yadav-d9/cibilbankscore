import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

// Layout
import Layout from "./pages/auth/Layout";

// Auth Pages
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/SignUp";
import LoginAgent from "./pages/auth/LoginAgent";
import B2BSignup from "./pages/auth/B2BSignup";
import UserInput from "./pages/auth/UserInput";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Home & Service Pages
import Home from "./pages/auth/Home";
import BankingAPIPage from "./pages/auth/BankingAPIPage";
import B2BBankingSystems from "./pages/auth/B2BBankingSystems";
import LoanServicesPage from "./pages/auth/LoanServicesPage";
import CreditBuildingSolutions from "./pages/auth/CreditBuildingSolutions";
import ATMInstallationPage from "./pages/auth/ATMInstallationPage";
import InvestmentDashboard from "./pages/auth/InvestmentDashboard";
import ExpertConnect from "./pages/auth/ExpertConnect";
import LoanDocumentsPage from "./pages/auth/LoanDocumentsPage";

// User Views
import AboutUs from "./components/user-view/AboutUs";
import CareerPage from "./components/user-view/CareerPage";
import Dashboard from "./components/user-view/Dashboard";
import CreditCheck from "./components/user-view/CreditCheck";
import LoanInformation from "./components/user-view/LoanInformation";
import LoanProcessor from "./components/user-view/LoanProcessor";
import UserLoanpage from "./pages/auth/UserLoanPage";

// Admin & Business Views
import AdminLogin from "./components/admin-view/AdminLogin";
import AdminPanel from "./components/admin-view/AdminPanel";
import BusinessLogin from "./components/business-view/auth/BusinessLogin";
import B2BDashboard from "./components/business-view/B2BDashboard";
import TermsAndConditions from "./components/business-view/B2bServicesActivate";

// User Data Pages
import UserBasicData from "./pages/auth/UserBasicData";
import UserAddress from "./pages/auth/UserAddress";
import UserSecondAddress from "./pages/auth/UserSecondAddress";
import UserCoApplications from "./pages/auth/UserCoApplications";
import UserSaveRefrences from "./pages/auth/UserSaveRefrences";
import UserPreviousData from "./pages/auth/UserPreviousData";
import LoanReportDetail from "./pages/auth/LoanReportDetail";
import UserDocuments from "./pages/auth/UserDocuments.jsx";
import MyApplication from "./pages/auth/MyApplication.jsx";
import CustomerLegalAdvice from "./pages/auth/CustomerLegalAdvice.jsx";

import ForgotPasswordAgent from "./pages/auth/ForgotPasswordAgent.jsx";
import ResetPasswordAgent from "./pages/auth/ResetPasswordAgent.jsx";
import MyProfile from "./myProfile/MyProfile.jsx";

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedTypes = ["customer", "agent", "admin", "business"],
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(user.userType)) {
    // Redirect based on user type
    switch (user.userType) {
      case "customer":
        return <Navigate to="/dashboard" replace />;
      // case "admin":
      //   return <Navigate to="/admin" replace />;
      case "business":
        return <Navigate to="/business-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/LoginAgent" element={<LoginAgent />} />
            <Route path="/B2BSignup" element={<B2BSignup />} />
            <Route path="/userinput" element={<UserInput />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/business-login" element={<BusinessLogin />} />
            {/* user forgot password */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Agent forget password */}
            <Route path="/forgot-password-agent" element={<ForgotPasswordAgent/>}/> 
            <Route path="/reset-password/:token" element={<ResetPasswordAgent/>}/>


            {/* my profile */}
            <Route path="/my-profile" element={<MyProfile/>}/>

            {/* Service Pages */}
            <Route path="/services/banking-apis" element={<BankingAPIPage />} />
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

            {/* Protected Customer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-check"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <CreditCheck />
                </ProtectedRoute>
              }
            />

            <Route
              path="/CustomerLegalAdvice"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <CustomerLegalAdvice />
                </ProtectedRoute>
              }
            />



            <Route
              path="/loan"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <LoanInformation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserLoanInput"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <LoanProcessor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserLoanpage"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserLoanpage />
                </ProtectedRoute>
              }
            />

            {/* User Data Routes */}
            <Route
              path="/UserBasicData"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserBasicData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserAddress"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserAddress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserSecondAddress"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserSecondAddress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserCoApplications"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserCoApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserSaveRefrences"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserSaveRefrences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserPreviousData"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserPreviousData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/LoanReportDetail"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <LoanReportDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/UserDocuments"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <UserDocuments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/MyApplication"
              element={
                <ProtectedRoute allowedTypes={["customer", "business"]}>
                  <MyApplication />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expert-connect"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <ExpertConnect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loan-documents"
              element={
                <ProtectedRoute allowedTypes={["customer"]}>
                  <LoanDocumentsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Protected Business Routes */}
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute allowedTypes={["business"]}>
                  <B2BDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TermsAndConditions"
              element={
                <ProtectedRoute allowedTypes={["business"]}>
                  <TermsAndConditions />
                </ProtectedRoute>
              }
            />



            {/* Catch-all Route */}
            <Route
              path="*"
              element={
                <div className="text-center py-10">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
