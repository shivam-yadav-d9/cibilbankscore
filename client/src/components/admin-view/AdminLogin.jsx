import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Hardcoded credentials
  const ADMIN_EMAIL = "admin@dbnpe.com";
  const ADMIN_PASSWORD = "admin123!";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay for authentication
    setTimeout(() => {
      try {
        // Check credentials against hardcoded values
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          // Store admin data in localStorage
          const adminData = {
            id: "admin1",
            email: ADMIN_EMAIL,
            name: "Admin User",
            role: "administrator"
          };
          
          // Create a mock token (for UI purposes only)
          const mockToken = "mock-jwt-token-" + Date.now();
          
          localStorage.setItem("adminToken", mockToken);
          localStorage.setItem("admin", JSON.stringify(adminData));
          
          navigate("/admin");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 800); // Simulate network delay
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12">
        {/* Brand Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-2xl font-extrabold text-white">DB</span>
            </div>
            <div className="h-16 w-16 bg-gradient-to-bl from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg ml-2 transform rotate-6">
              <span className="text-2xl font-extrabold text-white">NPE</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white">DBNPE</h1>
          <p className="mt-2 text-sm text-indigo-300 font-medium">Admin Portal</p>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Background glows */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
          
          {/* Card content */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Card header */}
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-center text-2xl font-bold text-white tracking-tight">Admin Access</h2>
              <p className="mt-2 text-center text-sm text-indigo-200">
                Sign in to your administrator account
              </p>
            </div>

            {/* Error display */}
            {error && (
              <div className="mx-8 mb-4 p-3 bg-red-600/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
                <p className="text-red-300 text-center text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
                    Admin Email
                  </label>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-4 py-3 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="admin@dbnpe.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-indigo-100">
                      Password
                    </label>
                    <Link to="/admin/forgot-password" className="text-xs font-medium text-indigo-300 hover:text-white transition-colors duration-200">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-12 py-3 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-indigo-300 hover:text-white focus:outline-none transition-colors duration-200"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security code/2FA - Optional addition for admin security */}
                {/* <div>
                  <label htmlFor="securityCode" className="block text-sm font-medium text-indigo-100 mb-2">
                    Security Code (2FA)
                  </label>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="securityCode"
                      name="securityCode"
                      type="text"
                      autoComplete="one-time-code"
                      className="appearance-none block w-full pl-12 pr-4 py-3 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="6-digit code (if enabled)"
                    />
                  </div>
                </div> */}

                {/* Remember device */}
                <div className="flex items-center">
                  <input
                    id="remember-device"
                    name="remember-device"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-device" className="ml-2 block text-sm text-indigo-200">
                    Remember this device
                  </label>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white 
                    ${loading 
                      ? "bg-indigo-600/70 cursor-not-allowed" 
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:-translate-y-1"}`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Access Admin Panel
                        <svg className="ml-2 -mr-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* Return to main site */}
              <div className="mt-8 text-center">
                <p className="text-sm text-indigo-200">
                  Not an administrator?{" "}
                  <Link to="/" className="font-medium text-indigo-400 hover:text-white transition-colors duration-200">
                    Return to main site
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-indigo-300">
            &copy; 2025 DBNPE. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-xs text-indigo-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-xs text-indigo-300 hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;