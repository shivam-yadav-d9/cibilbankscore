import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const LoginAgent = ({ updateAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/agent/login`, {
        email,
        password,
      });

      if (response.data.token) {
        // Create user data object with business type
        const userData = {
          ...response.data.user,
          token: response.data.token,
          userType: "business", // Always set to business for agents
          email: email,
        };

        console.log(userData)
        // Use AuthContext login
        login(userData);

        if (updateAuth) {
          updateAuth(true);
        }

        // Navigate to business dashboard
        navigate("/business-dashboard", { state: { userId: response.data.user._id } });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-900/90 to-indigo-900/90 backdrop-blur-xl border border-white/10">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image & Branding */}
          <div className="w-full md:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-800/20 to-purple-900/20">
            <div className="absolute inset-0 bg-pattern opacity-5"></div>
            <div className="h-full flex flex-col justify-between p-8 md:p-12">
              <div className="mb-12">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">DB</span>
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
                    DBNPE
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <img
                  src="/Agentimage.png"
                  alt="Agent Portal"
                  className="max-w-full h-auto object-cover filter drop-shadow-2xl"
                />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-white mb-2">Agent Portal</h3>
                <p className="text-indigo-200">Access your dashboard, manage clients, and grow your business all in one place.</p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-indigo-200 text-sm">Secure Access</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-indigo-200 text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Title */}
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                Welcome Back
              </h1>
              <p className="text-indigo-300 mb-8">
                Sign in to your agent account to continue
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/30">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-300 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-indigo-200"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                      className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition duration-200"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-indigo-200"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password-agent"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                      className="block w-full pl-12 pr-12 py-3.5 bg-white/5 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition duration-200"
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-indigo-500/30 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-indigo-900"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember-me" className="text-indigo-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3.5 px-6 rounded-xl text-white font-medium transition duration-200 ${loading
                        ? "bg-indigo-700/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30"
                      }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>

              {/* Registration Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-indigo-300">
                  Don't have an account?{" "}
                  <Link
                    to="/B2BSignup"
                    className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Register as an Agent
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAgent;