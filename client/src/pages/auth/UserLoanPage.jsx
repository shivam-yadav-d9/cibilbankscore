import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";

const UserLoanPage = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [hoverLoan, setHoverLoan] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const getLoanColor = (loanName) => {
    const colors = [
      "from-blue-600 to-indigo-800",
      "from-purple-600 to-pink-700",
      "from-emerald-600 to-teal-800",
      "from-amber-500 to-orange-700",
      "from-cyan-600 to-blue-800",
      "from-fuchsia-600 to-purple-800",
    ];
    
    // Simple hash function to consistently assign colors
    const nameHash = loanName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[nameHash % colors.length];
  };

  const authenticate = async () => {
    try {
      const config = {
        method: "post",
        url: "https://uat-api.evolutosolution.com/v1/authentication",
        headers: {
          source: "web",
          package: "10.0.2.215",
          outletid: "OUI202590898",
          Authorization:
            "Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o=",
        },
      };

      const response = await axios.request(config);
      if (response.data.success) {
        setAuthToken(response.data.data.token);
        return response.data.data.token;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const response = await fetch(
          "https://uat-api.evolutosolution.com/v1/loan/getLoanTypes"
        );
        const data = await response.json();
        if (data.success) {
          setLoanTypes(data.data);
        } else {
          setError("Failed to fetch loan types");
        }
      } catch (err) {
        setError("Error fetching loan types");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanTypes();
  }, []);

  const handleSelectLoan = (loanId) => {
    setSelectedLoan(loanId);
    // Add a small delay to show animation
    setTimeout(() => {
      navigate(`/UserLoanInput`, { state: { loan_type_id: loanId } });
    }, 400);
  };

  const handleGetDocuments = async (loanId) => {
    setFetchingDocs(true);
    setSelectedLoan(loanId);
    try {
      // Get fresh token each time
      const token = await authenticate();

      const response = await axios({
        method: "get",
        url: `https://uat-api.evolutosolution.com/v1/loan/getRequiredDocs?ref_code=OUI202590898&loan_type_id=${loanId}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
          source: "web",
          package: "10.0.2.215",
          outletid: "OUI202590898",
        },
      });

      if (response.data.success) {
        const documents = response.data.data;
        // Navigate to documents page with the data
        setTimeout(() => {
          navigate("/loan-documents", {
            state: {
              documents: documents,
              loanName:
                loanTypes.find((loan) => loan.id === loanId)?.name || "Loan",
            },
          });
        }, 400);
      } else {
        throw new Error(response.data.message || "Failed to fetch documents");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error fetching documents";
      alert(errorMessage);
      setSelectedLoan(null);
    } finally {
      setFetchingDocs(false);
    }
  };

  // Loader component with theme support
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-32 h-32 border-4 ${isDarkMode ? 'border-blue-500' : 'border-blue-600'} border-opacity-20 rounded-full`}></div>
            <div className={`w-32 h-32 border-4 border-transparent ${isDarkMode ? 'border-t-blue-500' : 'border-t-blue-600'} rounded-full animate-spin absolute`}></div>
          </div>
          <div className="w-32 h-32 relative flex items-center justify-center">
            <div className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'} font-mono text-xl space-y-1`}>
              <span className="block animate-pulse">Loading</span>
              <span className="flex justify-center space-x-1">
                <span className={`w-2 h-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full animate-bounce delay-75`}></span>
                <span className={`w-2 h-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full animate-bounce delay-100`}></span>
                <span className={`w-2 h-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full animate-bounce delay-150`}></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error component with theme support
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-90' : 'bg-gray-50'}`}>
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-8 rounded-2xl shadow-2xl max-w-md w-full ${isDarkMode ? 'border border-red-500 border-opacity-30' : 'border border-red-200'}`}>
          <div className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-100'} rounded-full`}>
            <svg
              className="w-10 h-10 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-center text-red-500 font-mono">
            SYSTEM ERROR
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-6`}>
            {error}. Please try again later or contact support if the issue persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none font-mono uppercase tracking-wider flex items-center justify-center"
          >
            <svg 
              className="w-5 h-5 mr-2 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Reinitialize System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} py-16 px-4`}>
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-1/3 h-1/3 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full filter blur-3xl opacity-10`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'} rounded-full filter blur-3xl opacity-10`}></div>
        <div className={`absolute top-1/4 left-1/4 w-1/4 h-1/4 ${isDarkMode ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full filter blur-3xl opacity-5`}></div>
        <div className="grid grid-cols-12 absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`h-full w-px bg-gradient-to-b from-transparent ${isDarkMode ? 'via-gray-800' : 'via-gray-200'} to-transparent opacity-10`}></div>
          ))}
        </div>
        <div className="grid grid-rows-12 absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-full h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-800' : 'via-gray-200'} to-transparent opacity-10`}></div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Next-Gen Financial Solutions
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Explore our intelligent loan options tailored to your unique financial journey
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loanTypes.map((loan) => (
            <div
              key={loan.id}
              className={`group relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} shadow-xl transform transition-all duration-500 ${
                selectedLoan === loan.id ? "scale-95 opacity-75" : hoverLoan === loan.id ? "scale-105" : ""
              }`}
              onMouseEnter={() => setHoverLoan(loan.id)}
              onMouseLeave={() => setHoverLoan(null)}
            >
              {/* Background gradients */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getLoanColor(loan.name)} ${isDarkMode ? 'opacity-20' : 'opacity-10'}`}></div>
              <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-30'}`}></div>
              
              {/* Animated borders */}
              <div className={`absolute inset-0 border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} opacity-50 rounded-2xl`}></div>
              <div className={`absolute inset-0 border-2 border-transparent bg-gradient-to-br ${getLoanColor(loan.name)} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} style={{ maskImage: "linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor" }}></div>
              
              <div className="relative z-10 p-8">
                {/* Loan content */}
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {loan.name}
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {loan.description || `Apply for ${loan.name} and get competitive rates with flexible terms.`}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Instant approval</span>
                    </div>
                    {/* ... other features ... */}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`group relative py-3 px-6 overflow-hidden rounded-lg font-medium focus:outline-none flex items-center justify-center ${
                      selectedLoan === loan.id 
                        ? `${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}` 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                    }`}
                    onClick={() => handleSelectLoan(loan.id)}
                    disabled={selectedLoan !== null}
                  >
                    Apply Now
                  </button>
                  <button
                    className={`group relative py-3 px-6 overflow-hidden rounded-lg font-medium focus:outline-none flex items-center justify-center ${
                      fetchingDocs && selectedLoan === loan.id
                        ? `${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`
                        : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
                    }`}
                    onClick={() => handleGetDocuments(loan.id)}
                    disabled={fetchingDocs || selectedLoan !== null}
                  >
                    Get Documents
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loanTypes.length === 0 && (
          <div className={`text-center py-16 ${isDarkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-white bg-opacity-90'} backdrop-filter backdrop-blur-sm rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {/* ... empty state content ... */}
          </div>
        )}

        {/* Footer info section */}
        <div className="mt-20 text-center">
          <div className="inline-block p-px bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-full px-8 py-2`}>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Secure • Encrypted • Advanced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoanPage;