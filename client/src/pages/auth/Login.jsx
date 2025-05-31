import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";

const Login = ({ updateAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        email,
        password,
      });
      if (response.data.token) {
        // Use the login function from AuthContext
        login({
          ...response.data.user,
          token: response.data.token,
          email: email,
        });

        // Decode the JWT to get the userType
        const decodedToken = jwtDecode(response.data.token);
        const userType = decodedToken.userType;

        if (updateAuth) {
          updateAuth(true);
        }

        // Redirect based on userType
        if (userType === "customer") {
          navigate("/dashboard");
        } else if (userType === "business") {
          navigate("/business-dashboard");
        } else {
          console.warn("Unknown user type:", userType);
          navigate("/default-dashboard");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 right-20 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl border border-white/10 z-10 relative">
        {/* Left Side - Imagery */}
        <div className="relative w-full md:w-1/2 overflow-hidden">
          {/* Gradient overlay for image */}
          <div className="relative h-64 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/40 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/50"></div>
            
            {/* Main image */}
            <img
              src="/hero.webp"
              alt="DBNPE platform visualization"
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 scale-110 animate-slow-zoom"
            />
          </div>
          
          {/* Floating brand element with depth effect */}
          <div className="absolute bottom-8 left-8 z-20">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">DBNPE</h2>
                  <p className="text-indigo-200 text-sm">Secure. Powerful. Intuitive.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glass decorative elements */}
          <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-blue-500/20 backdrop-blur-sm border border-white/10 animate-float"></div>
          <div className="absolute top-24 right-24 w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-sm border border-white/10 animate-float-slow"></div>
          <div className="absolute bottom-32 right-16 w-16 h-16 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-white/10 animate-float-delay"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative">
          {/* Header with animation */}
          <div className="text-center md:text-left mb-8 relative">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-indigo-200">Sign in to your DBNPE account to continue</p>
            <div className="absolute -top-1 left-0 h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Error Message with improved animation */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 backdrop-blur-sm border border-red-500/30 animate-pulse-slow">
              <p className="text-red-300 text-sm font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Login Form with enhanced animations */}
          <form onSubmit={handleLogin} className="space-y-6 flex-grow">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-indigo-100 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-indigo-300/20 rounded-xl text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-focus-within:w-full transition-all duration-300"></div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-indigo-100 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-indigo-300/20 rounded-xl text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••••"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-focus-within:w-full transition-all duration-300"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="remember-me" 
                    id="remember-me" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${rememberMe ? 'bg-indigo-500' : 'bg-gray-600'}`}
                  ></label>
                </div>
                <label htmlFor="remember-me" className="text-sm text-indigo-200">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-300 hover:text-white transition-colors relative group">
                  Forgot password?
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>

            {/* Submit Button with enhanced effects */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden group py-4 px-6 rounded-xl text-white font-medium 
                  ${loading
                    ? "bg-indigo-700/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                  }`}
              >
                {/* Button background animation */}
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-72 group-hover:h-72 opacity-10 group-active:opacity-20"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Button content */}
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Links with enhanced styling */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-center text-indigo-200">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-indigo-400 hover:text-white transition-colors relative inline-block group">
                  Create account
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
              
              {/* Admin Login with glass effect */}
              <Link 
                to="/admin-login" 
                className="text-sm text-center py-3 px-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-indigo-200 hover:bg-white/10 transition-all flex items-center justify-center group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Admin Login
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Security badge */}
          <div className="absolute bottom-4 right-4 flex items-center text-xs text-indigo-300/70">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Connection
          </div>
        </div>
      </div>
      
      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slow-zoom {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1.1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: transparent;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #6366f1;
        }
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0V20M0 1H20' stroke='white' stroke-opacity='0.1' stroke-width='0.5'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default Login;