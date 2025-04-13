import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

const LoanProcessor = () => {
    const location = useLocation(); // Get location object
    const loanTypeId = location.state?.loan_type_id; // Retrieve loan_type_id

    // Pre-populate with test data for easier testing
    const [formData, setFormData] = useState({
        ref_code: "OUI202590898",
        name: "",
        email: "",
        mobile: "",
        phone: "",
        income_source: "1",
        income: "",
        pincode: "",
        dob: "",
        pan_no: "",
        aadhaar_no: "",
        cibil_score: "",
        loan_amount: "",
        loan_type_id: loanTypeId // Initialize with the passed value
    });

    const [apiToken, setApiToken] = useState("");
    const [loanTypes, setLoanTypes] = useState([]);
    const [eligibilityResult, setEligibilityResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Authentication credentials - already Base64 encoded in the Authorization header
    const BASE_URL = "https://uat-api.evolutosolution.com/v1";

    useEffect(() => {
        if (!loanTypeId) {
            console.error("Loan type ID is missing. This should not happen.");
            setError("Loan type ID is missing. Please go back and select a loan type.");
            return; // Stop further execution if loanTypeId is missing
        }
    }, [loanTypeId]);

    // Function to get API token
    const fetchToken = async () => {
        try {
            setError("");
            setIsAuthenticating(true);

            const response = await axios({
                method: 'post',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/authentication`,
                headers: {
                    'source': 'web',
                    'package': '10.0.2.215',
                    'outletid': 'OUI202590898',
                    'Authorization': 'Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o='
                }
            });

            if (response.data && response.data.data && response.data.data.token) {
                setApiToken(response.data.data.token);
                console.log("Token acquired successfully");
                // After getting token, fetch loan types
                fetchLoanTypes(response.data.data.token);
            } else {
                setError("Failed to get API token: No token in response");
            }
        } catch (err) {
            console.error("Token fetch error:", err);
            setError(`Authentication failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsAuthenticating(false);
        }
    };

    // Function to fetch loan types
    const fetchLoanTypes = async (token) => {
        try {
            setLoading(true);
            const config = {
                method: 'get',
                url: `${BASE_URL}/loan/getLoanTypes`,
                headers: {
                    'token': token,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.request(config);

            if (response.data && response.data.data) {
                setLoanTypes(response.data.data);

            } else {
                console.warn("No loan types received");
            }
        } catch (err) {
            console.error("Loan types fetch error:", err);
            setError(`Failed to fetch loan types: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for mobile/phone to keep them in sync
        if (name === "mobile") {
            setFormData({
                ...formData,
                mobile: value,
                phone: value
            });
        }
        else if (name === "phone") {
            setFormData({
                ...formData,
                phone: value,
                mobile: value
            });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Check eligibility
    const checkEligibility = async (e) => {
        if (e) e.preventDefault();

        if (!apiToken) {
            setError("API token is required. Please authenticate first.");
            return;
        }

        if (!formData.loan_type_id) {
            setError("Please select a loan type");
            return;
        }

        setError("");
        setLoading(true);
        setEligibilityResult(null);

        // Extract first and last name from full name for API compatibility
        const nameParts = formData.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Create API request data with first and last name fields
        const eligibilityData = {
            ...formData,
            fname: firstName,
            lname: lastName
        };

        try {
            const config = {
                method: 'post',
                url: `${BASE_URL}/loan/checkEligibility`,
                headers: {
                    'token': apiToken,
                    'Content-Type': 'application/json'
                },
                data: eligibilityData
            };

            const response = await axios.request(config);
            setEligibilityResult(response.data);
        } catch (err) {
            console.error("Eligibility check error:", err);
            setError(err.response?.data?.message || "Failed to check eligibility");
        } finally {
            setLoading(false);
        }
    };

    // Load token on component mount
    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        // Update form data when loanTypeId changes (e.g., when navigating from UserLoanpage)
        setFormData(prev => ({ ...prev, loan_type_id: loanTypeId }));
    }, [loanTypeId]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Loan Eligibility Check
            </h2>

            {/* Status messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {isAuthenticating && !error && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                    Authenticating...
                </div>
            )}

            {loading && !error && !isAuthenticating && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                    Processing request...
                </div>
            )}

            {!isAuthenticating && apiToken && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Authentication successful
                </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between mb-4">
                <button
                    onClick={fetchToken}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isAuthenticating}
                >
                    {apiToken ? "Refresh Token" : "Authenticate"}
                </button>
            </div>

            {/* Form */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                            Mobile
                        </label>
                        <input
                            id="mobile"
                            name="mobile"
                            type="text"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                            Date of Birth
                        </label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pan_no">
                            PAN Number
                        </label>
                        <input
                            id="pan_no"
                            name="pan_no"
                            type="text"
                            value={formData.pan_no}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income_source">
                            Income Source
                        </label>
                        <select
                            id="income_source"
                            name="income_source"
                            value={formData.income_source}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="1">Salaried</option>
                            <option value="2">Self-employed</option>
                            <option value="3">Business</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income">
                            Monthly Income
                        </label>
                        <input
                            id="income"
                            name="income"
                            type="number"
                            value={formData.income}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                            Pincode
                        </label>
                        <input
                            id="pincode"
                            name="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadhaar_no">
                            Aadhaar Number
                        </label>
                        <input
                            id="aadhaar_no"
                            name="aadhaar_no"
                            type="text"
                            value={formData.aadhaar_no}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cibil_score">
                            CIBIL Score
                        </label>
                        <input
                            id="cibil_score"
                            name="cibil_score"
                            type="text"
                            value={formData.cibil_score}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loan_amount">
                            Loan Amount
                        </label>
                        <input
                            id="loan_amount"
                            name="loan_amount"
                            type="number"
                            value={formData.loan_amount}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={checkEligibility}
                        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${!apiToken || loading || isAuthenticating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        disabled={!apiToken || loading || isAuthenticating}
                    >
                        Check Eligibility
                    </button>
                </div>
            </div>

            {/* Eligibility Result */}
            {eligibilityResult && (
                <div className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
                    <h3 className="text-xl font-bold mb-2">Eligibility Result</h3>

                    <div className="border-t border-b py-3 mb-3">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">Status:</span>
                            <span className={eligibilityResult.success ? "text-green-600" : "text-red-600"}>
                                {eligibilityResult.success ? "Eligible" : "Not Eligible"}
                            </span>
                        </div>

                        {eligibilityResult.message && (
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Message:</span>
                                <span>{eligibilityResult.message}</span>
                            </div>
                        )}

                        {eligibilityResult.data && (
                            <div className="mt-3">
                                <h4 className="font-medium mb-2">Details:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                    {JSON.stringify(eligibilityResult.data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Debug Section */}
          <Link to="/UserBasicData">  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out">
                Apply Continue
            </button>

           </Link>


        </div>
    );
};

export default LoanProcessor;