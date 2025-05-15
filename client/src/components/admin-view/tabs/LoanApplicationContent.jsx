import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Assuming framer-motion is available
import { useAuth } from '../../../contexts/AuthContext'; // Adjust path as needed
import { useTheme } from '../../../contexts/ThemeContext'; // Adjust path as needed

const LoanApplicationContent = () => {
  const { user, isAuthenticated } = useAuth(); // Get the current user
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      const allApplications = documentKeys.map((key) => {
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
        let user_id = null; // Track the user ID for filtering

        if (formDataStr) {
          try {
            const parsedFormData = JSON.parse(formDataStr);
            bank_id = parsedFormData.bank_id || 'N/A';
            bank_name = parsedFormData.bank_name || 'Unknown Bank';
            loan_amount = parsedFormData.loan_amount || 'N/A';
            name = parsedFormData.name || 'N/A';
            email = parsedFormData.email || 'N/A';
            mobile = parsedFormData.mobile || 'N/A';
            user_id = parsedFormData.user_id || null; // Store user_id if available
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
          user_id // Include user_id for filtering
        };
      });

      // In admin panel, we show all applications instead of filtering
      setApplications(allApplications);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      setLoading(false);
    }
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-document.png';
    e.target.alt = 'Document preview not available';
  };

  const handleViewDetails = (applicationId) => {
    // Navigate to loan processor or show a detail modal
    alert(`Viewing details for application ${applicationId}`);
    // In real implementation, you might navigate to another page or open a modal
  };

  const handleApprove = (applicationId) => {
    setApplications(applications.map(app => 
      app.applicationId === applicationId ? {...app, status: 'Approved'} : app
    ));
  };

  const handleReject = (applicationId) => {
    setApplications(applications.map(app => 
      app.applicationId === applicationId ? {...app, status: 'Rejected'} : app
    ));
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Loan Applications Overview</h2>
        <p className="text-gray-500">Manage and review customer loan applications</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-500">Total Applications</h3>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-full">
              <span className="sr-only">Count</span>
            </span>
          </div>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-500">Pending Review</h3>
            <span className="p-2 bg-yellow-100 text-yellow-800 rounded-full">
              <span className="sr-only">Pending</span>
            </span>
          </div>
          <p className="text-2xl font-bold">{applications.filter(app => app.status === 'Pending').length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-500">Total Loan Amount</h3>
            <span className="p-2 bg-green-100 text-green-800 rounded-full">
              <span className="sr-only">Amount</span>
            </span>
          </div>
          <p className="text-2xl font-bold">
            ₹{applications.reduce((total, app) => {
              const amount = Number(app.loan_amount) || 0;
              return total + amount;
            }, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md flex items-center">
          <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          <p>Loading applications data...</p>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Applications Table */}
      {!loading && applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Applications Available</h3>
          <p className="text-gray-500">There are currently no loan applications in the system.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                          {app.mobile !== 'N/A' && (
                            <div className="text-sm text-gray-500">{app.mobile}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.applicationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.bank_name}</div>
                      <div className="text-sm text-gray-500">ID: {app.bank_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{Number(app.loan_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.documents.length} documents
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(app.applicationId)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md">
                          View
                        </button>
                        {app.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(app.applicationId)}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md">
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(app.applicationId)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md">
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Modal would go here */}
    </div>
  );
};

export default LoanApplicationContent;