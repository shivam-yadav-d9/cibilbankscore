import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // Correct

const LoginAgent = ({ updateAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3001/agent/login", {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // Decode the JWT to get the userType
                const decodedToken = jwtDecode(response.data.token);  // Decode JWT
                const userType = decodedToken.userType;

                // Redirect based on userType
                if (userType === 'agent') {
                    navigate("/business-dashboard");
                } else {
                    console.warn("Unexpected user type:", userType);
                    navigate("/default-dashboard");
                }


            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            console.error(
                "Error:",
                error.response?.data?.message || error.message
            );
            setError(
                error.response?.data?.message || "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-0 sm:px-6 lg:px-8 mt-0">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden m-2">
    
                {/* Left Side - Image */}
                <div className="flex w-full md:w-1/2 items-center justify-center md:mt-5 md:p-5 p-0 mt-20">
                    <img src="/Agentimage.png" alt="hero" className="w-full h-auto object-cover" />
                </div>
    

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8">
                    {/* Title */}
                    <h1 className="text-center mt-6 text-3xl font-extrabold tracking-tight text-white">
                        Welcome to DBNPAY! (Agent)
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-600/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
                            <p className="text-red-300 text-center text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="mt-6 space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-100 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 text-indigo-300 hover:text-white"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-indigo-200">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg text-white font-medium 
                  ${loading
                                        ? "bg-indigo-600/70 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg transition-transform hover:-translate-y-1"}`}
                            >
                                {loading ? "Sign in as Agent..." : "Sign in as Agent"}
                            </button>
                        </div>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-indigo-200">
                            <Link to="/forgot-password" className="text-indigo-400 hover:text-white">
                                Forgot password?
                            </Link>
                        </p>
                        <p className="text-sm text-indigo-200 mt-2">
                            Don't have an Agent account?{" "}
                            <Link to="/B2BSignup" className="text-indigo-400 hover:text-white">
                                Sign up as Agent
                            </Link>
                        </p>

                        <p className="text-sm text-indigo-200 mt-2">
                            Login as Customer?{" "}
                            <Link to="/login" className="text-indigo-400 hover:text-white">
                                Go To Customer Login 👉
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAgent;