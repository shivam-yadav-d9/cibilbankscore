import { useState, useEffect } from "react";
import api from "../../services/api";

const CreditCheck = () => {
  const [formData, setFormData] = useState({
    ref_code: "OUI202590898", // Default value
    fname: "",
    lname: "",
    phone: "",
    pan_no: "",
    dob: "",
  });

  const [apiToken, setApiToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenLoading, setTokenLoading] = useState(true);
  const [debug, setDebug] = useState({ tokenAttempted: false });

  // Fetch API token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      setDebug(prev => ({ ...prev, tokenAttempted: true }));
      try {
        console.log("Fetching token from:", `${api.defaults.baseURL}/credit/token`);
        const response = await api.get("/credit/token");
        console.log("Token response:", response);
        setApiToken(response.data.token);
        setDebug(prev => ({ ...prev, tokenSuccess: true }));
      } catch (err) {
        console.error("Token fetch error:", err);
        setError(`Failed to get API token: ${err.message}. ${err.response?.data?.message || ''}`);
        setDebug(prev => ({ 
          ...prev, 
          tokenError: err.message,
          responseData: err.response?.data,
          responseStatus: err.response?.status
        }));
      } finally {
        setTokenLoading(false);
      }
    };

    fetchToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await api.post("/credit/check-score", formData, {
        headers: {
          "X-API-Token": apiToken,
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check credit score");
    } finally {
      setLoading(false);
    }
  };

  if (tokenLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading API token...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Check Credit Score
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Debug information */}
      {debug.tokenAttempted && !debug.tokenSuccess && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Debug Information:</h3>
          <p>API URL: {api.defaults.baseURL}</p>
          <p>Error: {debug.tokenError}</p>
          <p>Status: {debug.responseStatus}</p>
          <p>Response: {JSON.stringify(debug.responseData)}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Form fields remain the same */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ref_code"
          >
            Reference Code
          </label>
          <input
            id="ref_code"
            name="ref_code"
            type="text"
            value={formData.ref_code}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Default reference code used
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fname"
          >
            First Name
          </label>
          <input
            id="fname"
            name="fname"
            type="text"
            value={formData.fname}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lname"
          >
            Last Name
          </label>
          <input
            id="lname"
            name="lname"
            type="text"
            value={formData.lname}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pan_no"
          >
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

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dob"
          >
            Date of Birth (YYYY-MM-DD)
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

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading || !apiToken}
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              !apiToken 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Checking..." : "Check Credit Score"}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Credit Score Result</h3>

          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Success:</span>
              <span
                className={result.success ? "text-green-600" : "text-red-600"}
              >
                {result.success ? "Yes" : "No"}
              </span>
            </div>

            {result.message && (
              <div className="flex justify-between">
                <span className="font-medium">Message:</span>
                <span>{result.message}</span>
              </div>
            )}

            {result.statusCode && (
              <div className="flex justify-between">
                <span className="font-medium">Status Code:</span>
                <span>{result.statusCode}</span>
              </div>
            )}

            {/* Display additional data if available in the response */}
            {result.data && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Additional Data:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCheck;