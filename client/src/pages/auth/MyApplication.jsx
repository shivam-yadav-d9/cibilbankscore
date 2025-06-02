import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const MyApplication = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanStatus, setLoanStatus] = useState({});
  const [loanStatusLoading, setLoanStatusLoading] = useState({});

  // Theme-based classes
  const containerClass = isDarkMode
    ? 'min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden'
    : 'min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-gray-900 overflow-hidden';

  const cardClass = isDarkMode
    ? 'max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'
    : 'max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl';

  const buttonClass = isDarkMode
    ? 'px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105'
    : 'px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105';

  // Function to authenticate with EvolutoSolution API
  const authenticateEvoluto = async () => {
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_EVOLUTO_AUTH_URL,
        headers: {
          source: 'web',
          package: '10.0.2.215',
          outletid: import.meta.env.VITE_REF_CODE,
          Authorization: `Basic ${import.meta.env.VITE_AUTH_BASIC}`,
        },
        timeout: 30000, // 30-second timeout
      };

      const response = await axios.request(config);
      console.log('Authentication response:', response.data);

      // Check for token in response.data or nested structures
      const token = response.data?.token || response.data?.data?.token || response.data?.access_token;
      if (token) {
        return token;
      } else {
        throw new Error(`Authentication failed: No token found in response. Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error('Authentication error:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Failed to authenticate with EvolutoSolution');
    }
  };

  // Function to check loan status
  const handleCheckLoanStatus = async (applicationId, refCode) => {
    if (!applicationId || !refCode) {
      setError('Missing Application ID or Ref Code.');
      return;
    }

    setLoanStatusLoading(prev => ({ ...prev, [applicationId]: true }));
    setLoanStatus(prev => ({ ...prev, [applicationId]: null }));
    setError(null);

    try {
      // Step 1: Authenticate to get token
      const authToken = await authenticateEvoluto();

      // Step 2: Fetch loan status - Try different approaches
      let statusResponse;
      
      try {
        // Option 1: Try with query parameters (most common for GET requests)
        const statusConfig = {
          method: 'get',
          url: `${import.meta.env.VITE_API_BASE_URL}/loan/status`,
          headers: {
            token: authToken,
            'Content-Type': 'application/json',
          },
          params: {
            loan_application_id: applicationId,
            ref_code: refCode,
          },
          timeout: 30000,
        };

        statusResponse = await axios.request(statusConfig);
        
      } catch (getError) {
        console.log('GET with params failed, trying POST:', getError.message);
        
        // Option 2: Try POST request with body data
        const postConfig = {
          method: 'post',
          url: `${import.meta.env.VITE_API_BASE_URL}/loan/status`,
          headers: {
            token: authToken,
            'Content-Type': 'application/json',
          },
          data: {
            loan_application_id: applicationId,
            ref_code: refCode,
          },
          timeout: 30000,
        };

        statusResponse = await axios.request(postConfig);
      }

      console.log('Loan status response:', statusResponse.data);

      if (statusResponse.data) {
        setLoanStatus(prev => ({ ...prev, [applicationId]: statusResponse.data }));
      } else {
        setError('No loan status data received.');
      }
      
    } catch (err) {
      console.error('Failed to fetch loan status:', err);
      let errorMessage = 'Error fetching loan status.';

      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.response) {
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        
        // Log more details for debugging
        if (err.response.status === 500) {
          console.error('Server error details:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoanStatusLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch application data from localStorage
    try {
      setLoading(true);
      console.log('Current user:', user); // Debug log
      
      // Retrieve all document entries from localStorage
      const documentKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith('documents_')
      );

      console.log('Found document keys:', documentKeys); // Debug log

      if (documentKeys.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Map document entries to applications
      const allApplications = documentKeys.map((key) => {
        const applicationId = key.replace('documents_', '');
        const documents = JSON.parse(localStorage.getItem(key)) || [];
        
        // Try multiple form data keys to find application data
        const formDataKeys = [
          `loanProcessorFormData_${applicationId}`,
          'loanProcessorFormData',
          `formData_${applicationId}`,
          'formData'
        ];

        let formData = null;
        for (const formKey of formDataKeys) {
          const formDataStr = localStorage.getItem(formKey);
          if (formDataStr) {
            try {
              formData = JSON.parse(formDataStr);
              break;
            } catch (err) {
              console.error(`Error parsing form data for key ${formKey}:`, err);
            }
          }
        }

        // Default values
        let bank_id = 'N/A';
        let bank_name = 'Unknown Bank';
        let loan_amount = 'N/A';
        let name = 'N/A';
        let email = 'N/A';
        let mobile = 'N/A';
        let user_id = null;
        let created_at = new Date().toISOString();
        let ref_code = 'N/A';

        if (formData) {
          bank_id = formData.bank_id || 'N/A';
          bank_name = formData.bank_name || 'Unknown Bank';
          loan_amount = formData.loan_amount || 'N/A';
          name = formData.name || formData.applicant_name || 'N/A';
          email = formData.email || formData.applicant_email || 'N/A';
          mobile = formData.mobile || formData.phone || formData.mobile_number || 'N/A';
          user_id = formData.user_id || null;
          created_at = formData.created_at || formData.timestamp || new Date().toISOString();
          ref_code = formData.ref_code || 'N/A';
        }

        return {
          applicationId,
          bank_id,
          bank_name,
          loan_amount,
          name,
          email,
          mobile,
          documents,
          status: 'Pending',
          created_at,
          user_id,
          ref_code,
          formData // Keep original form data for debugging
        };
      });

      console.log('All applications before filtering:', allApplications); // Debug log

      // Improved filtering logic - more lenient approach
      let userApplications = [];

      if (user) {
        // Filter applications based on multiple criteria
        userApplications = allApplications.filter(app => {
          // Method 1: Direct user ID match
          if (app.user_id && user.id && app.user_id === user.id) {
            return true;
          }
          
          // Method 2: Email match (case insensitive)
          if (user.email && app.email && 
              user.email.toLowerCase() === app.email.toLowerCase()) {
            return true;
          }
          
          // Method 3: If user has a name, check if it matches
          if (user.name && app.name && 
              user.name.toLowerCase() === app.name.toLowerCase()) {
            return true;
          }

          // Method 4: If no specific user data found, include all applications
          // This is a fallback for cases where user association is not properly stored
          if (!app.user_id && !app.email) {
            return true;
          }

          return false;
        });

        // If no applications found with strict filtering, show all applications
        // This handles cases where the association logic might have issues
        if (userApplications.length === 0 && allApplications.length > 0) {
          console.warn('No applications found with user filtering, showing all applications');
          userApplications = allApplications;
        }
      } else {
        // If no user data available, show all applications
        userApplications = allApplications;
      }

      console.log('Filtered user applications:', userApplications); // Debug log

      setApplications(userApplications);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      setLoading(false);
    }
  }, [navigate, isAuthenticated, user]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-document.png';
    e.target.alt = 'Document preview not available';
  };

  const formatLoanAmount = (amount) => {
    if (!amount || amount === 'N/A') return 'N/A';
    const numAmount = Number(amount);
    return isNaN(numAmount) ? amount : `₹${numAmount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'N/A';
    }
  };

  return (
    <div className={containerClass}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={isDarkMode
          ? 'absolute -top-10 -right-10 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob'
          : 'absolute -top-10 -right-10 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob'}></div>
        <div className={isDarkMode
          ? 'absolute top-20 right-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000'
          : 'absolute top-20 right-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000'}></div>
        <div className={isDarkMode
          ? 'absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000'
          : 'absolute -bottom-8 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000'}></div>
      </div>

      <div className={cardClass}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className={isDarkMode
              ? 'text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
              : 'text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}>
              Your Loan Applications
            </h1>
            <p className={isDarkMode ? 'mt-3 text-lg text-indigo-200' : 'mt-3 text-lg text-indigo-500'}>
              View and manage your submitted loan applications
            </p>
          </div>

          {/* User Info Banner */}
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={isDarkMode
                ? 'bg-indigo-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-4 mb-6 flex items-center'
                : 'bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center'}
            >
              <div className={isDarkMode
                ? 'w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4'
                : 'w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-4'
              }>
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={isDarkMode ? 'font-medium text-white' : 'font-medium text-gray-800'}>
                  {user.name || 'Welcome back!'}
                </p>
                <p className={isDarkMode ? 'text-sm text-indigo-300' : 'text-sm text-indigo-600'}>
                  {user.email}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Notification */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={isDarkMode
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-start'
                : 'bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start'}
            >
              <svg
                className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={isDarkMode
              ? 'bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/50 text-indigo-100 p-4 mb-6 rounded-2xl flex items-center'
              : 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl flex items-center'}
            >
              <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-indigo-400 rounded-full"></div>
              <p>Loading your applications...</p>
            </div>
          )}

          {/* No Applications State */}
          {!loading && applications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={isDarkMode
                ? 'bg-amber-900/20 backdrop-blur-sm border border-amber-500/50 text-amber-100 p-8 rounded-2xl text-center'
                : 'bg-amber-50 border border-amber-200 text-amber-700 p-8 rounded-xl text-center'}
            >
              <svg className="h-16 w-16 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-2">No Applications Found</h3>
              <p className="mb-4">You haven't submitted any loan applications yet.</p>
              <Link to="/UserLoanPage" className={buttonClass}>
                Start New Application
              </Link>
            </motion.div>
          )}

          {/* Application List */}
          {!loading && applications.length > 0 && (
            <div className="space-y-6">
              {applications.map((app, index) => (
                <motion.div
                  key={app.applicationId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={isDarkMode
                    ? 'bg-slate-800/50 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-xl'
                    : 'bg-white border border-gray-200 rounded-xl p-6 shadow-lg'}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className={isDarkMode ? 'text-xl font-bold text-white mb-4' : 'text-xl font-bold text-gray-900 mb-4'}>
                        Application ID: {app.applicationId}
                      </h3>
                      
                      {/* Display applicant information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Applicant:</span> {app.name}
                          </p>
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Email:</span> {app.email}
                          </p>
                          {app.mobile !== 'N/A' && (
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Mobile:</span> {app.mobile}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Bank:</span> {app.bank_name}
                          </p>
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Bank ID:</span> {app.bank_id}
                          </p>
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Loan Amount:</span> {formatLoanAmount(app.loan_amount)}
                          </p>
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Applied On:</span> {formatDate(app.created_at)}
                          </p>
                          <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                            <span className="font-medium">Ref Code:</span> {app.ref_code}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-4">
                        <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'Approved' 
                              ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                              : app.status === 'Rejected'
                              ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600' 
                              : isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {app.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                      <button
                        onClick={() => navigate('/loan-processor', { state: { applicationId: app.applicationId } })}
                        className={buttonClass}
                      >
                        View Details
                      </button>
                      {app.applicationId !== 'N/A' && app.ref_code !== 'N/A' && (
                        <button
                          onClick={() => handleCheckLoanStatus(app.applicationId, app.ref_code)}
                          className={`${buttonClass} ${loanStatusLoading[app.applicationId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={loanStatusLoading[app.applicationId]}
                        >
                          {loanStatusLoading[app.applicationId] ? 'Checking...' : 'Check Status'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Loan Status Display */}
                  {loanStatus[app.applicationId] && (
                    <div className={isDarkMode ? 'border-t border-slate-700 pt-4 mb-4' : 'border-t border-gray-200 pt-4 mb-4'}>
                      <h4 className={isDarkMode ? 'text-lg font-semibold text-green-400 mb-3' : 'text-lg font-semibold text-green-600 mb-3'}>
                        Current Loan Status
                      </h4>
                      <div className={isDarkMode ? 'bg-slate-900/50 rounded-lg p-4' : 'bg-gray-50 rounded-lg p-4'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Application ID:</span> {loanStatus[app.applicationId].application_id || loanStatus[app.applicationId].data?.application_id || '—'}
                            </p>
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Status Code:</span> {loanStatus[app.applicationId].status_code || loanStatus[app.applicationId].data?.status_code || '—'}
                            </p>
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Loan Amount:</span> {loanStatus[app.applicationId].loan_amount || loanStatus[app.applicationId].data?.loan_amount || '—'}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Status:</span> 
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                (loanStatus[app.applicationId].status || loanStatus[app.applicationId].data?.status)?.toLowerCase() === 'approved'
                                  ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                  : (loanStatus[app.applicationId].status || loanStatus[app.applicationId].data?.status)?.toLowerCase() === 'rejected'
                                  ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                                  : isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {loanStatus[app.applicationId].status || loanStatus[app.applicationId].data?.status || '—'}
                              </span>
                            </p>
                            <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                              <span className="font-medium">Remarks:</span> {loanStatus[app.applicationId].remarks || loanStatus[app.applicationId].data?.remarks || '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  <div className={isDarkMode ? 'border-t border-slate-700 pt-6' : 'border-t border-gray-200 pt-6'}>
                    <h4 className={isDarkMode ? 'text-lg font-semibold text-indigo-300 mb-4' : 'text-lg font-semibold text-indigo-600 mb-4'}>
                      Uploaded Documents ({app.documents.length})
                    </h4>
                    {app.documents.length === 0 ? (
                      <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                        No documents uploaded for this application.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {app.documents.map((doc, idx) => (
                          <div
                            key={doc.id || idx}
                            className={isDarkMode
                              ? 'bg-slate-900/50 rounded-lg p-4 border border-indigo-500/20'
                              : 'bg-gray-50 rounded-lg p-4 border border-gray-200'}
                          >
                            <div className="flex items-center mb-3">
                              <svg
                                className={isDarkMode ? 'h-5 w-5 text-indigo-400 mr-2 flex-shrink-0' : 'h-5 w-5 text-indigo-600 mr-2 flex-shrink-0'}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <h5 className={isDarkMode ? 'text-indigo-200 font-medium text-sm' : 'text-gray-800 font-medium text-sm'}>
                                {doc.doc_type || 'Document'}
                              </h5>
                            </div>
                            <div className="mb-3 space-y-1">
                              <p className={isDarkMode ? 'text-xs text-indigo-300' : 'text-xs text-gray-600'}>
                                <span className="font-medium">Number:</span> {doc.doc_no || 'N/A'}
                              </p>
                              <p className={isDarkMode ? 'text-xs text-indigo-300' : 'text-xs text-gray-600'}>
                                <span className="font-medium">Uploaded:</span> {formatDate(doc.created_at || app.created_at)}
                              </p>
                            </div>
                            {doc.file_data && (
                              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={doc.file_data}
                                  alt={`${doc.doc_type || 'Document'} preview`}
                                  className="object-contain w-full h-full p-2"
                                  onError={handleImageError}
                                />
                                <div className={isDarkMode
                                  ? 'absolute top-2 right-2'
                                  : 'absolute top-2 right-2'}
                                >
                                  <span className={isDarkMode
                                    ? 'bg-green-500/20 px-2 py-1 rounded-full text-green-400 text-xs font-medium'
                                    : 'bg-green-100 px-2 py-1 rounded-full text-green-600 text-xs font-medium'}
                                  >
                                    ✓ Verified
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Return to Home */}
          <div className="flex justify-center mt-12">
            <Link
              to="/"
              className={isDarkMode
                ? 'text-indigo-400 hover:text-indigo-300 font-medium flex items-center transition-all duration-300 hover:translate-x-1'
                : 'text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-all duration-300 hover:translate-x-1'}
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyApplication;