import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Layout from "./pages/auth/Layout"; // Import Layout
import Login from "./pages/auth/Login"; // Could not resolve "./pages/auth/Login" from "src/App.jsx"
import Register from "./pages/auth/Register";
import UserInput from "./pages/auth/UserInput";
import Dashboard from "./components/user-view/Dashboard";
import AdminPanel from "./components/admin-view/AdminPanel";
import LoanInformation from "./components/user-view/LoanInformation";
import AdminLogin from "./components/admin-view/AdminLogin";
import B2BDashboard from "./components/business-view/B2BDashboard";


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
        {/* Routes with Navbar & Footer */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login updateAuth={updateAuth} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/userinput" element={<UserInput />} />

          {/* Other Routes without Navbar & Footer */}
          <Route path="/" element={<Login updateAuth={updateAuth} />} />
          <Route path="/loan" element={<LoanInformation />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>
        
        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard updateAuth={updateAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <AdminPanel /> : <Navigate to="/admin-login" />
          }
        />

<Route
          path="/business-dashboard"
          element={
            isAuthenticated ? <B2BDashboard /> : <Navigate to="/admin-login" />
          }
        />



        {/* 404 Not Found Page */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-white mt-10">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
