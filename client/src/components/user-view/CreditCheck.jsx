import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const CreditCheck = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { user, isAuthenticated } = useAuth();

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [apiToken, setApiToken] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [jwtToken, setJwtToken] = useState("");

    const CREDIT_CHECK_COST = 50;
    const API_BASE_URL = "https://api.evolutosolution.com/v1";
    const REF_CODE = import.meta.env.VITE_REF_CODE;
    const AUTH_BASIC = import.meta.env.VITE_AUTH_BASIC;

    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        phone: "",
        pan_no: "",
        dob: "",
        ref_code: REF_CODE,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const previousFormData = localStorage.getItem("loanProcessorFormData");

        if (!token || !isAuthenticated) {
            navigate("/login");
            return;
        }
        setJwtToken(token);

        fetchWalletBalance();

        if (previousFormData) {
            const parsedData = JSON.parse(previousFormData);
            setFormData((prev) => ({
                ...prev,
                dob: parsedData.dob || prev.dob,
                phone: parsedData.mobile || prev.phone,
                pan_no: parsedData.pan_no || prev.pan_no,
            }));
        }

        if (userData) {
            const userObj = JSON.parse(userData);
            if (userObj.name) {
                const nameParts = userObj.name.split(" ");
                setFormData((prev) => ({
                    ...prev,
                    fname: nameParts[0] || "",
                    lname: nameParts.slice(1).join(" ") || "",
                    phone: userObj.mobile || prev.phone,
                }));
            }
        }
    }, [navigate, isAuthenticated]);

    const fetchWalletBalance = async () => {
        if (!user?.email) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/wallet/balance?email=${encodeURIComponent(user.email)}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setWalletBalance(data.balance || 0);
                }
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };

    const fetchToken = async () => {
        try {
            setError("");
            setIsAuthenticating(true);

            const config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${API_BASE_URL}/authentication`,
                headers: {
                    source: "web",
                    package: "10.0.2.215",
                    outletid: REF_CODE,
                    Authorization: `Basic ${AUTH_BASIC}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.request(config);

            if (response.data && response.data.data && response.data.data.token) {
                const token = response.data.data.token;
                setApiToken(token);
                setSuccess("Authentication successful");
                const payload = token.split('.')[1];
                const decodedPayload = atob(payload);
                const decodedToken = JSON.parse(decodedPayload);
                const tokenExpiry = decodedToken.exp * 1000;
                localStorage.setItem("apiToken", JSON.stringify({ token, expiry: tokenExpiry }));
            } else {
                setError("Failed to get API token: No token in response");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setIsAuthenticating(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("apiToken");
        if (storedToken) {
            const { token, expiry } = JSON.parse(storedToken);
            const currentTime = Date.now();
            if (currentTime < expiry) {
                setApiToken(token);
                setSuccess("Authentication successful");
                return;
            }
        }
        fetchToken();
    }, [jwtToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // const checkCachedCreditScore = () => {
    //     const cachedScores = localStorage.getItem("creditScores");
    //     if (!cachedScores) return null;

    //     const scores = JSON.parse(cachedScores);
    //     const existingScore = scores.find(score => score.phone === formData.phone);
    //     if (!existingScore) return null;

    //     const oneMonthAgo = new Date();
    //     oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    //     if (new Date(existingScore.createdAt) >= oneMonthAgo && existingScore.credit_score) {
    //         return {
    //             success: true,
    //             message: "Credit score fetched from cache.",
    //             data: {
    //                 success: true,
    //                 message: "Success",
    //                 statusCode: 200,
    //                 data: {
    //                     name: `${existingScore.fname} ${existingScore.lname}`,
    //                     score: existingScore.credit_score,
    //                 },
    //             },
    //         };
    //     }
    //     return null;
    // };

    const saveCreditScoreToCache = (data) => {
        let scores = [];
        const cachedScores = localStorage.getItem("creditScores");
        if (cachedScores) {
            scores = JSON.parse(cachedScores);
            scores = scores.filter(score => score.phone !== formData.phone);
        }

        const newScore = {
            ref_code: formData.ref_code,
            fname: formData.fname,
            lname: formData.lname,
            phone: formData.phone,
            pan_no: formData.pan_no,
            dob: formData.dob,
            credit_score: data?.data?.score || null,
            status: data?.statusCode,
            message: data?.message,
            createdAt: new Date().toISOString(),
        };

        scores.push(newScore);
        localStorage.setItem("creditScores", JSON.stringify(scores));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!apiToken) {
            setError("API token is required. Please authenticate first.");
            return;
        }

        if (walletBalance < CREDIT_CHECK_COST) {
            setError(
                `Insufficient wallet balance! You need ₹${CREDIT_CHECK_COST} to check your credit score. Current balance: ₹${walletBalance.toFixed(2)}`
            );
            return;
        }

        // const cachedResult = checkCachedCreditScore();
        // if (cachedResult) {
        //     setResult(cachedResult);
        //     setSuccess("Credit score check completed successfully!");
        //     return;
        // }

        setShowPayment(true);
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        setError(null);

        try {
            setLoading(true);

            // Step 1: Prepare credit check data
            const creditCheckData = {
                fname: formData.fname,
                lname: formData.lname,
                phone: formData.phone,
                pan_no: formData.pan_no.toUpperCase(),
                dob: formData.dob,
                ref_code: formData.ref_code,
            };

            // Step 2: Call the credit score check API
            const creditConfig = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${API_BASE_URL}/loan/checkCreditScore`,
                headers: {
                    token: apiToken,
                    "Content-Type": "application/json",
                    source: "web",
                    package: "10.0.215",
                    outletid: REF_CODE,
                },
                data: creditCheckData,
            };

            const creditResponse = await axios.request(creditConfig);
            const responseData = creditResponse.data;

            // Step 3: Deduct wallet balance if credit check is successful
            if (responseData?.success && responseData?.data?.score) {
                const deductConfig = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `${import.meta.env.VITE_BACKEND_URL}/api/wallet/spend`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        email: user.email,
                        amount: CREDIT_CHECK_COST,
                        description: "Credit score check payment",
                    },
                };

                const deductResponse = await axios.request(deductConfig);
                
                if (!deductResponse.data?.success) {
                    throw new Error(deductResponse.data?.message || "Failed to deduct wallet balance.");
                }
            } else {
                throw new Error(responseData?.message || "Credit score check failed.");
            }

            // Step 4: Update state and cache on success
            setResult({
                success: true,
                message: "Credit score successfully fetched",
                data: responseData,
            });
            setSuccess("Credit score check and payment completed successfully!");
            setShowPayment(false);

            // Save to cache
            saveCreditScoreToCache(responseData);
            if (responseData?.data?.score) {
                localStorage.setItem("userCibilScore", responseData.data.score.toString());
                console.log("Saved CIBIL Score:", responseData.data.score);
            }

            // Refresh wallet balance
            await fetchWalletBalance();
            localStorage.setItem("creditCheckResult", JSON.stringify(responseData));
        } catch (error) {
            console.error("Error processing payment or checking credit score:", error);
            setError(error.response?.data?.message || error.message || "Failed to process payment or check credit score. Please try again.");
            setShowPayment(false);
        } finally {
            setLoading(false);
            setPaymentLoading(false);
        }
    };

    const cancelPayment = () => {
        setShowPayment(false);
        setError(null);
    };

    const containerClass = isDarkMode
        ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
        : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

    const cardClass = isDarkMode
        ? "max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
        : "max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

    const innerClass = isDarkMode ? "p-8 md:p-12" : "p-8 md:p-12";

    const sectionTitleClass = isDarkMode
        ? "text-4xl font-bold text-white mb-2"
        : "text-4xl font-bold text-gray-900 mb-2";

    const labelClass = isDarkMode
        ? "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-400"
        : "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-600";

    const inputClass = isDarkMode
        ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
        : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

    const buttonClass = isDarkMode
        ? "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1"
        : "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1";

    const scoreCardClass = isDarkMode
        ? "bg-slate-800/50 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 mt-8"
        : "bg-white border border-gray-200 rounded-2xl p-6 mt-8 shadow-lg";

    return (
        <div className={containerClass}>
            <div className={cardClass}>
                <div className={innerClass}>
                    <div
                        className={
                            isDarkMode
                                ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/30 rounded-2xl p-4 mb-6"
                                : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6"
                        }
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className={isDarkMode ? "text-indigo-300 text-sm" : "text-indigo-600 text-sm"}>Your Wallet Balance</p>
                                <p className={isDarkMode ? "text-white text-xl font-bold" : "text-gray-900 text-xl font-bold"}>
                                    ₹{walletBalance.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className={isDarkMode? "text-purple-300 text-sm" : "text-purple-600 text-sm"}>Credit Check Cost</p>
                                <p className={isDarkMode ? "text-white text-xl font-bold" : "text-gray-900 text-xl font-bold"}>₹{CREDIT_CHECK_COST}</p>
                            </div>
                            <button
                                onClick={() => navigate("/wallet")}
                                className={
                                    isDarkMode
                                        ? "px-4 py-2 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-200 rounded-lg transition-colors"
                                        : "px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                                }
                            >
                                Add Money
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className={
                                isDarkMode
                                    ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-pulse"
                                    : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-pulse"
                            }
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div
                            className={
                                isDarkMode
                                    ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
                                    : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"
                            }
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p>{success}</p>
                        </div>
                    )}

                    {isAuthenticating && (
                        <div
                            className={
                                isDarkMode
                                    ? "bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/50 text-indigo-100 p-4 mb-6 rounded-2xl flex items-center"
                                    : "bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl flex items-center"
                            }
                        >
                            <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-indigo-400 rounded-full"></div>
                            <p>Authenticating...</p>
                        </div>
                    )}

                    {isLoading && (
                        <div
                            className={
                                isDarkMode
                                    ? "bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-100 p-4 mb-6 rounded-2xl flex items-center"
                                    : "bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl flex items-center"
                            }
                        >
                            <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-indigo-400 rounded-full"></div>
                            <p>Processing request...</p>
                        </div>
                    )}

                    {showPayment && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div
                                className={
                                    isDarkMode
                                        ? "bg-slate-800 border border-indigo-500/30 rounded-2xl p-8 max-w-md w-full mx-4"
                                        : "bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                                }
                            >
                                <div className="text-center">
                                    <div
                                        className={
                                            isDarkMode
                                                ? "w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                                : "w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        }
                                    >
                                        <svg
                                            className={isDarkMode ? "w-8 h-8 text-indigo-400" : "w-8 h-8 text-indigo-600"}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className={isDarkMode ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-gray-900 mb-2"}>Confirm Payment</h3>

                                    <p className={isDarkMode ? "text-slate-300 mb-6" : "text-gray-600 mb-6"}>
                                        You will be charged ₹{CREDIT_CHECK_COST} from your wallet to check your credit score.
                                    </p>

                                    <div className={isDarkMode ? "bg-slate-700/50 rounded-lg p-4 mb-6" : "bg-gray-50 rounded-lg p-4 mb-6"}>
                                        <div className="flex justify-between items-center">
                                            <span className={isDarkMode ? "text-slate-300" : "text-gray-600"}>Current Balance:</span>
                                            <span className={isDarkMode ? "text-white font-medium" : "text-gray-900 font-medium"}>₹{walletBalance.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={isDarkMode ? "text-slate-300" : "text-gray-600"}>After Payment:</span>
                                            <span className={isDarkMode ? "text-white font-medium" : "text-gray-900 font-medium"}>
                                                ₹{(walletBalance - CREDIT_CHECK_COST).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={cancelPayment}
                                            disabled={paymentLoading}
                                            className={
                                                isDarkMode
                                                    ? "flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
                                                    : "flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePayment}
                                            disabled={paymentLoading}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {paymentLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                "Pay & Check Score"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-4">
                                <div
                                    className={
                                        isDarkMode
                                            ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                            : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                                    }
                                ></div>
                            </div>
                            <h2 className={sectionTitleClass}>
                                <span
                                    className={
                                        isDarkMode
                                            ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                                            : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                                    }
                                >
                                    Credit Score Check
                                </span>
                            </h2>
                            <p className={isDarkMode ? "text-slate-300" : "text-gray-500"}>Enter your details to check your credit score for ₹{CREDIT_CHECK_COST}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6 md:col-span-2">
                                <div className="flex items-center">
                                    <div
                                        className={
                                            isDarkMode
                                                ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                                                : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                                        }
                                    ></div>
                                    <h3
                                        className={
                                            isDarkMode ? "text-lg font-medium text-indigo-300 px-4 flex items-center" : "text-lg font-medium text-indigo-600 px-4 flex items-center"
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Details
                                    </h3>
                                    <div
                                        className={
                                            isDarkMode
                                                ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                                                : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"
                                        }
                                    ></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group relative">
                                        <input name="fname" placeholder=" " value={formData.fname} onChange={handleChange} required className={inputClass} />
                                        <label className={labelClass}>First Name</label>
                                    </div>

                                    <div className="group relative">
                                        <input name="lname" placeholder=" " value={formData.lname} onChange={handleChange} required className={inputClass} />
                                        <label className={labelClass}>Last Name</label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group relative">
                                        <input name="phone" placeholder=" " value={formData.phone} onChange={handleChange} required className={inputClass} />
                                        <label className={labelClass}>Phone Number</label>
                                    </div>

                                    <div className="group relative">
                                        <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className={inputClass} />
                                        <label className={isDarkMode ? "absolute left-4 top-0 text-indigo-400 text-xs font-medium" : "absolute left-4 top-0 text-indigo-600 text-xs font-medium"}>
                                            Date of Birth
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 md:col-span-2">
                                <div className="flex items-center">
                                    <div
                                        className={
                                            isDarkMode
                                                ? "h-px flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                                                : "h-px flex-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                                        }
                                    ></div>
                                    <h3
                                        className={
                                            isDarkMode ? "text-lg font-medium text-indigo-300 px-4 flex items-center" : "text-lg font-medium text-indigo-600 px-4 flex items-center"
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                            />
                                        </svg>
                                        PAN Details
                                    </h3>
                                    <div
                                        className={
                                            isDarkMode
                                                ? "h-px flex-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-transparent"
                                                : "h-px flex-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-transparent"
                                        }
                                    ></div>
                                </div>

                                <div className="group relative">
                                    <input name="pan_no" placeholder=" " value={formData.pan_no} onChange={handleChange} required className={inputClass} />
                                    <label className={labelClass}>PAN Number</label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isLoading || walletBalance < CREDIT_CHECK_COST || isAuthenticating}
                                className={`${buttonClass} ${(isLoading || walletBalance < CREDIT_CHECK_COST || isAuthenticating) ? "bg-gray-600 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                                        Checking Credit Score...
                                    </div>
                                ) : walletBalance < CREDIT_CHECK_COST ? (
                                    <span className="flex items-center justify-center">
                                        Insufficient Balance - Add ₹{(CREDIT_CHECK_COST - walletBalance).toFixed(2)} More
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Check Credit Score (₹{CREDIT_CHECK_COST})
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10当然293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {result && (
                        <div className={scoreCardClass}>
                            <h3 className={`mb-6 text-xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>Credit Score Result</h3>

                            <div
                                className={
                                    isDarkMode
                                        ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30"
                                        : "bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100"
                                }
                            >
                                {result.success === false ? (
                                    <div className="text-center">
                                        <div className={isDarkMode ? "text-red-400" : "text-red-600"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="text-lg font-medium">{result.message || "Failed to fetch credit score."}</p>
                                            {result.error && <p className="text-sm mt-2">{result.error}</p>}
                                        </div>
                                    </div>
                                ) : result.data?.data ? (
                                    <div className="text-center">
                                        <div
                                            className={
                                                isDarkMode
                                                    ? "inline-block rounded-full p-3 bg-green-900/30 border border-green-500/30 mb-4"
                                                    : "inline-block rounded-full p-3 bg-green-100 border border-green-200 mb-4"
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={isDarkMode ? "h-16 w-16 text-green-400" : "h-16 w-16 text-green-500"}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <div
                                            className={
                                                isDarkMode
                                                    ? "text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300"
                                                    : "text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500"
                                            }
                                        >
                                            {result.data.data.score || "N/A"}
                                        </div>

                                        <div className={isDarkMode ? "text-xl font-medium text-green-300 mb-6" : "text-xl font-medium text-green-700 mb-6"}>
                                            {result.data.data.name || "Unknown"}
                                        </div>

                                        <div className={isDarkMode ? "text-sm text-slate-300 max-w-md mx-auto" : "text-sm text-gray-600 max-w-md mx-auto"}>
                                            This credit score is provided based on the information you've submitted. A higher score indicates better creditworthiness.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className={isDarkMode ? "text-red-400" : "text-red-600"}>No data available to display. Please try again later.</p>
                                    </div>
                                )}
                            </div>

                            {result.success && result.data?.data && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={
                                            isDarkMode
                                                ? "bg-slate-800/60 rounded-lg p-4 border border-indigo-500/20"
                                                : "bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                                        }
                                    >
                                        <h4 className={isDarkMode ? "text-indigo-300 font-medium mb-2" : "text-indigo-600 font-medium mb-2"}>Next Steps</h4>
                                        <p className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-600"}>
                                            Based on your credit score, you may qualify for various loan products. Continue your application to explore options.
                                        </p>
                                    </div>

                                    <div
                                        className={
                                            isDarkMode
                                                ? "bg-slate-800/60 rounded-lg p-4 border border-indigo-500/20"
                                                : "bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                                        }
                                    >
                                        <h4 className={isDarkMode ? "text-indigo-300 font-medium mb-2" : "text-indigo-600 font-medium mb-2"}>Tips</h4>
                                        <p className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-600"}>
                                            Maintain timely repayments of existing loans and credit cards to improve your credit score over time.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => navigate("/UserLoanpage")}
                                    className={
                                        isDarkMode
                                            ? "inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-200 transition-colors"
                                            : "inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Continue to Loan Application
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreditCheck;