import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext'; // Adjust path as needed

const MyApplication = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch application data from localStorage
    try {
      setLoading(true);
      // Retrieve all document entries from localStorage
      const documentKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith('documents_')
      );

      if (documentKeys.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Map document entries to applications
      const applicationsData = documentKeys.map((key) => {
        const applicationId = key.replace('documents_', '');
        const documents = JSON.parse(localStorage.getItem(key)) || [];
        
        // Retrieve corresponding loanProcessorFormData for this applicationId
        const formDataKey = `loanProcessorFormData_${applicationId}`;
        // Use fallback to general loanProcessorFormData if specific one doesn't exist
        const formDataStr = localStorage.getItem(formDataKey) || localStorage.getItem('loanProcessorFormData');
        
        let bank_id = 'N/A';
        let bank_name = 'Unknown Bank';
        let loan_amount = 'N/A';
        let name = 'N/A';
        let email = 'N/A';
        let mobile = 'N/A';

        if (formDataStr) {
          try {
            const parsedFormData = JSON.parse(formDataStr);
            bank_id = parsedFormData.bank_id || 'N/A';
            bank_name = parsedFormData.bank_name || 'Unknown Bank';
            loan_amount = parsedFormData.loan_amount || 'N/A';
            name = parsedFormData.name || 'N/A';
            email = parsedFormData.email || 'N/A';
            mobile = parsedFormData.mobile || 'N/A';
          } catch (err) {
            console.error('Error parsing form data:', err);
          }
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
          status: 'Pending', // Default status, can be updated if you have status info
          created_at: new Date().toISOString(), // Default date if not available
        };
      });

      setApplications(applicationsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      setLoading(false);
    }
  }, [navigate]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-document.png';
    e.target.alt = 'Document preview not available';
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
                className="h-5 w-5 mr-3"
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
              <p>Loading applications...</p>
            </div>
          )}

          {/* Application List */}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-2">No Applications Found</h3>
              <p className="mb-4">You haven't submitted any loan applications yet.</p>
              <Link to="/loan-processor" className={buttonClass}>
                Start New Application
              </Link>
            </motion.div>
          )}

          {!loading && applications.length > 0 && (
            <div className="space-y-6">
              {applications.map((app) => (
                <motion.div
                  key={app.applicationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={isDarkMode
                    ? 'bg-slate-800/50 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-xl'
                    : 'bg-white border border-gray-200 rounded-xl p-6 shadow-lg'}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className={isDarkMode ? 'text-xl font-bold text-white' : 'text-xl font-bold text-gray-900'}>
                        Application ID: {app.applicationId}
                      </h3>
                      
                      {/* Display applicant information */}
                      <div className="grid grid-cols-1 gap-2 mt-2">
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
                        <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                          <span className="font-medium">Bank:</span> {app.bank_name} (ID: {app.bank_id})
                        </p>
                        <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                          <span className="font-medium">Loan Amount:</span> ₹{Number(app.loan_amount).toLocaleString()}
                        </p>
                        <p className={isDarkMode ? 'text-indigo-300' : 'text-gray-600'}>
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
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
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <button
                        onClick={() => navigate('/loan-processor', { state: { applicationId: app.applicationId } })}
                        className={buttonClass}
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="border-t border-indigo-500/30 pt-4">
                    <h4 className={isDarkMode ? 'text-lg font-semibold text-indigo-300 mb-4' : 'text-lg font-semibold text-indigo-600 mb-4'}>
                      Uploaded Documents
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
                                className={isDarkMode ? 'h-5 w-5 text-indigo-400 mr-2' : 'h-5 w-5 text-indigo-600 mr-2'}
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
                              <h5 className={isDarkMode ? 'text-indigo-200 font-medium' : 'text-gray-800 font-medium'}>
                                {doc.doc_type}
                              </h5>
                            </div>
                            <div className="mb-2">
                              <p className={isDarkMode ? 'text-sm text-indigo-300' : 'text-sm text-gray-600'}>
                                Document Number: {doc.doc_no || 'N/A'}
                              </p>
                              <p className={isDarkMode ? 'text-sm text-indigo-300' : 'text-sm text-gray-600'}>
                                Uploaded On: {new Date(doc.created_at || app.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="relative h-32 rounded-lg overflow-hidden">
                              <img
                                src={doc.file_data}
                                alt={`${doc.doc_type} preview`}
                                className="object-contain w-full h-full p-2"
                                onError={handleImageError}
                              />
                              <div className={isDarkMode
                                ? 'absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-2'
                                : 'absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end p-2'}
                              >
                                <span className={isDarkMode
                                  ? 'bg-green-500/20 px-2 py-1 rounded-full text-green-400 text-xs font-medium'
                                  : 'bg-green-100 px-2 py-1 rounded-full text-green-600 text-xs font-medium'}
                                >
                                  Verified
                                </span>
                              </div>
                            </div>
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
          <div className="flex justify-center mt-10">
            <Link
              to="/"
              className={isDarkMode
                ? 'text-indigo-400 hover:text-indigo-300 font-medium flex items-center transition-all duration-300'
                : 'text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-all duration-300'}
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