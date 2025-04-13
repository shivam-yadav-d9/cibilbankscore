import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UserLoanInput = () => {
  const location = useLocation();
  const loanTypeId = location.state?.loan_type_id || "60"; // Default value if not provided
  const [apiToken, setApiToken] = useState("");

  const [formData, setFormData] = useState({
    loan_type_id: loanTypeId,
    name: "",
    email: "",
    mobile: "",
    income_source: "1",
    income: "",
    pincode: "",
    dob: "",
    pan_no: "",
    aadhaar_no: "",
    cibil_score: "750",
    loan_amount: "",
  });

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenLoading, setTokenLoading] = useState(true);

  // Fetch API token on component mount with proper headers
  useEffect(() => {
    const getToken = async () => {
      setTokenLoading(true);
      try {
        const response = await axios({
          method: "post",
          url: "https://uat-api.evolutosolution.com/v1/authentication",
          headers: {
            source: "web",
            package: "10.0.2.215",
            outletid: "OUI202590898",
            "Content-Type": "application/json",
            Authorization:
              "Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o=",
          },
        });

        console.log("Authentication response:", response.data);

        if (response.data && response.data.success && response.data.token) {
          setApiToken(response.data.token);
          console.log("Token received successfully:", response.data.token.substring(0, 10) + "...");
          setError("");
        } else {
          throw new Error(response.data?.message || "Failed to get authentication token");
        }
      } catch (err) {
        console.error("Token fetch error details:", err);
        setError("Authentication error: " + (err.response?.data?.message || err.message || "Unknown error"));
      } finally {
        setTokenLoading(false);
      }
    };

    getToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!apiToken) {
      setError("Authentication token not available. Please refresh the page and try again.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending eligibility request with data:", formData);

      const response = await axios({
        method: "post",
        url: "https://uat-api.evolutosolution.com/v1/loan/checkEligibility",
        headers: {
          "Content-Type": "application/json",
          token: apiToken.startsWith("Bearer ") ? apiToken : `Bearer ${apiToken}`,
          source: "web",
          package: "10.0.2.215",
          outletid: "OUI202590898",
        },
        data: formData,
      });

      console.log("Eligibility response:", response.data);

      if (response.data && response.data.success) {
        setOffers(response.data.data || []);
        if (response.data.data && response.data.data.length === 0) {
          setError("No eligible loan offers found based on your criteria.");
        }
      } else {
        throw new Error(response.data?.message || "Failed to fetch eligible loans");
      }
    } catch (err) {
      console.error("Eligibility check error details:", err);
      setError("Error checking eligibility: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl mb-4 font-semibold text-center">
        Enter Your Details
      </h2>

      {tokenLoading && (
        <p className="mb-4 text-center text-blue-500">Initializing application...</p>
      )}

      {error && <p className="mb-4 text-center text-red-500">{error}</p>}

      {!tokenLoading && apiToken && (
        <p className="mb-4 text-center text-green-500">System ready - Please fill your details</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "name", type: "text", label: "Full Name" },
          { name: "email", type: "email", label: "Email Address" },
          { name: "mobile", type: "text", label: "Mobile Number" },
          { name: "income", type: "number", label: "Monthly Income" },
          { name: "pincode", type: "text", label: "Pincode" },
          { name: "dob", type: "date", label: "Date of Birth" },
          { name: "pan_no", type: "text", label: "PAN Number" },
          { name: "aadhaar_no", type: "text", label: "Aadhaar Number" },
          { name: "loan_amount", type: "number", label: "Loan Amount" },
        ].map(({ name, type, label }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{label}</label>
            <input
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading || tokenLoading || !apiToken}
            className={`flex-1 p-2 rounded ${loading || tokenLoading || !apiToken
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
          >
            {loading ? "Checking..." : "Check Eligibility"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-4 text-center">
          <p>Processing your request...</p>
          <div className="mt-2 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      {/* first change */}
      {offers.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center mb-6">Eligible Loan Offers</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={offer.id || index}
                className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  {offer.bank_logo ? (
                    <img
                      src={offer.bank_logo}
                      alt={offer.bank || "Bank"}
                      className="h-10 w-auto mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100x50?text=Bank";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-16 bg-gray-200 mr-3 rounded" />
                  )}
                  <h4 className="text-lg font-semibold">{offer.bank || "Loan Offer"}</h4>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Loan Amount:</strong> ₹{offer.loan_amount?.toLocaleString() || "N/A"}</p>
                  <p><strong>Tenure:</strong> {offer.tenure || "N/A"}</p>
                  <p><strong>Interest Rate:</strong> {offer.bank_interest_rate ? `${offer.bank_interest_rate}%` : "N/A"}</p>
                </div>

                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {!loading && offers.length === 0 && formData.name && (
        <p className="mt-4 text-center text-orange-500">No loan offers available at this time. Please try different criteria.</p>
      )}

    </div>
  );
};

export default UserLoanInput;