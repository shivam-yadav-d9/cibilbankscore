import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Adjust the import path as needed for your project:
import { useTheme } from '../../contexts/ThemeContext'; // Assuming this path is correct

// Assuming you have an AnimatedNotification and StatusBadge component
// If not, define them within this file or import them.
// import AnimatedNotification from './AnimatedNotification'; // Example import
// import StatusBadge from './StatusBadge'; // Example import

// Define AnimatedNotification and StatusBadge components if they are not in separate files
function AnimatedNotification({ error, success }) {
    if (!error && !success) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-6 rounded-lg p-4 flex items-start ${
          error
            ? 'bg-red-500/20 border border-red-500/30'
            : 'bg-green-500/20 border border-green-500/30'
        }`}
      >
        <div className="flex-shrink-0">
          {error ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${error ? 'text-red-400' : 'text-green-400'}`}>
            {error || success}
          </h3>
        </div>
      </motion.div>
    );
}

function StatusBadge({ doc, status }) {
    if (status) {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    } else if (doc.required) {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Required
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Optional
        </span>
      );
    }
  }

// Define the API base URL
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different URL/port

function UserDocuments() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Retrieve application ID - prioritize location state, then local storage (as a fallback during transition, eventually remove LS)
  const [applicationId, setApplicationId] = useState(location.state?.applicationId || localStorage.getItem("applicationId"));

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documents, setDocuments] = useState([]); // Array of uploaded documents fetched from backend
  const [activeStep, setActiveStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningEffect, setScanningEffect] = useState(false);

  const documentTypes = [
    {
      key: 'PAN CARD',
      title: 'PAN Card',
      icon: 'id-card',
      required: true,
      hasNumber: true,
      numberKey: 'pan_no',
      numberLabel: 'PAN Number',
      description: 'Government-issued Personal Account Number card'
    },
    {
      key: 'AADHAAR CARD',
      title: 'Aadhaar Card',
      icon: 'fingerprint',
      required: true,
      hasNumber: true,
      numberKey: 'aadhaar_no',
      numberLabel: 'Aadhaar Number',
      description: 'Unique identification card with biometric data'
    },
    {
      key: 'INCOME PROOF',
      title: 'Income Proof',
      icon: 'document-text',
      required: false,
      hasNumber: false,
      description: 'Salary slips, tax returns, or bank statements'
    },
    {
      key: 'PHOTOGRAPH',
      title: 'Photograph',
      icon: 'camera',
      required: false,
      hasNumber: false,
      description: 'Recent passport-sized photograph with clear face'
    }
  ];

  // Use a map or object to easily check uploaded status by doc type
  // Store File object and preview data temporarily before final submission if needed,
  // or handle upload for each document individually.
  // Given the current flow (uploading one by one and simulating scan),
  // let's adjust uploadedFiles to store the temporary file object and preview.
  const [uploadedFiles, setUploadedFiles] = useState({
    'PAN CARD': null, // { file: File, preview: string (data URL), doc_type: string, doc_no: string, created_at: string }
    'AADHAAR CARD': null,
    'INCOME PROOF': null,
    'PHOTOGRAPH': null
  });

  const [docNumbers, setDocNumbers] = useState({
    pan_no: "",
    aadhaar_no: ""
  });

  // Fetch existing data from the backend on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Token might still be needed for auth, though not used in the simple backend demo
    if (!token) {
      navigate("/login");
      return;
    }
    if (!applicationId) {
      // If no application ID is available, navigate to the basic data page
      navigate("/UserBasicData");
      return;
    }

    // --- Fetch Documents from Backend ---
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        // Include token in headers if backend requires authentication
        const response = await fetch(`${API_BASE_URL}/documents/${applicationId}`, {
             headers: {
                 // 'Authorization': `Bearer ${token}` // Example auth header
             }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data); // Store the list of documents from the backend

        // Update uploadedFiles state based on fetched documents for preview/status
        const updatedFiles = { ...uploadedFiles };
        data.forEach(doc => {
            updatedFiles[doc.doc_type] = {
              // We store the preview (data URL) fetched from backend
              // If backend only returns paths, you'd fetch previews separately or store paths.
              preview: doc.file_data, // Assuming backend returns base64 data URL for demo
              doc_type: doc.doc_type,
              doc_no: doc.doc_no,
              created_at: doc.created_at,
              // Note: The actual 'File' object isn't stored here after fetching from backend
            };
        });
        setUploadedFiles(updatedFiles);

      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load existing documents.");
      } finally {
        setLoading(false);
      }
    };

    // --- Fetch User Basic Data from Backend ---
    const fetchUserBasicData = async () => {
        try {
             // Include token in headers if backend requires authentication
            const response = await fetch(`${API_BASE_URL}/user-data/${applicationId}`, {
                 headers: {
                    // 'Authorization': `Bearer ${token}` // Example auth header
                 }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user data');
            }
            const data = await response.json();
            // Assuming the backend returns { pan: '...', aadhaar: '...' } or similar
            if (data) {
                 setDocNumbers({
                    pan_no: data.pan || "", // Use 'pan' field from backend
                    aadhaar_no: data.aadhaar || "" // Use 'aadhaar' field from backend
                 });
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            // Decide if this is a blocking error or just means no data exists yet
            // setError("Failed to load user basic data.");
        }
    };


    fetchDocuments();
    fetchUserBasicData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, applicationId]); // Depend on navigate and applicationId

  const simulateDocumentScan = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      setShowScanner(true);
      setScanningEffect(true);
      // Simulate scan duration
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Store the temporary file object and its preview
          setUploadedFiles(prev => ({
            ...prev,
            [docType]: {
              file: file, // Store the actual File object
              preview: event.target.result, // Data URL preview
              doc_type: docType,
              // Generate or get doc_no immediately, this will be sent to backend later
              doc_no: docType === 'PAN CARD' ? docNumbers.pan_no :
                     docType === 'AADHAAR CARD' ? docNumbers.aadhaar_no :
                     generateDocNumber(docType), // Generate temporary number if not PAN/Aadhaar
              created_at: new Date().toISOString()
            }
          }));
          setScanningEffect(false);
          // Simulate verification completion delay
          setTimeout(() => {
            setShowScanner(false);
            // Move to the next step after successful scan/preview
            const currentIndex = documentTypes.findIndex(doc => doc.key === docType);
            if (currentIndex < documentTypes.length - 1) {
              setActiveStep(currentIndex + 1);
            }
          }, 1000); // Duration for verification complete state
        };
        reader.readAsDataURL(file); // Read file as data URL for preview
      }, 2000); // Duration for scanning effect
    }
  };

  const generateDocNumber = (docType) => {
    // This client-side generation is a fallback or for types without pre-filled numbers.
    // The backend should ideally assign/confirm document numbers where needed.
    switch (docType) {
      case 'PAN CARD':
        // For PAN, we prefer the entered number from docNumbers
        return docNumbers.pan_no || ('PAN' + Math.random().toString(36).substr(2, 8).toUpperCase());
      case 'AADHAAR CARD':
         // For Aadhaar, we prefer the entered number from docNumbers
        return docNumbers.aadhaar_no || Math.floor(Math.random() * 9000000000 + 1000000000).toString();
      case 'INCOME PROOF':
        return 'INC' + Math.random().toString(36).substr(2, 8).toUpperCase();
      case 'PHOTOGRAPH':
        return 'PHT' + Math.random().toString(36).substr(2, 8).toUpperCase();
      default:
        return 'DOC' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  };

  const handleDocNumberChange = (e) => {
    const { name, value } = e.target;
    setDocNumbers(prev => ({
      ...prev,
      [name]: value
    }));

    // Optional: Update the doc_no in uploadedFiles immediately if the document of that type is already selected
    const docType = documentTypes.find(doc => doc.numberKey === name)?.key;
     if (docType && uploadedFiles[docType]) {
         setUploadedFiles(prev => ({
             ...prev,
             [docType]: {
                 ...prev[docType],
                 doc_no: value // Update the doc_no in the temporary file object
             }
         }));
     }
  };

    // Function to upload a single document to the backend
    const uploadSingleDocument = async (docData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // docData should contain { doc_type, doc_no, file: File object }
        if (!docData || !docData.file) {
            console.error("No document data or file provided for upload.");
            setError("Error: Document file missing.");
            setLoading(false);
            return false; // Indicate failure
        }

        const formData = new FormData();
        formData.append('applicationId', applicationId); // Send application ID
        formData.append('doc_type', docData.doc_type); // Send document type
        // Only append doc_no if it exists
        if (docData.doc_no) {
             formData.append('doc_no', docData.doc_no); // Send document number
        }
        formData.append('file', docData.file); // Append the actual file object

        try {
            const response = await fetch(`${API_BASE_URL}/documents/upload`, {
                method: 'POST',
                // When using FormData, the 'Content-Type' header is automatically set
                // to 'multipart/form-data' with the correct boundary. Do NOT set it manually.
                 // headers: { // Example auth header if needed
                 //     'Authorization': `Bearer ${localStorage.getItem("token")}`
                 // }
                body: formData, // Send the FormData object
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to upload document');
            }

            // Update the documents list state with the newly uploaded document from the backend response
             setDocuments(prevDocs => {
                // Remove the old entry for this doc_type if it exists
                const filteredDocs = prevDocs.filter(doc => doc.doc_type !== result.doc_type);
                // Add the new document data received from the backend
                return [...filteredDocs, result];
            });

            // Update the uploadedFiles state to reflect successful backend upload
            // This ensures the preview and doc_no shown reflect the backend-saved data
            setUploadedFiles(prev => ({
                ...prev,
                [docData.doc_type]: {
                     preview: result.file_data, // Use data URL from backend response
                     doc_type: result.doc_type,
                     doc_no: result.doc_no,
                     created_at: result.created_at,
                     // Note: The original File object might not be needed anymore here
                     // file: null, // Could set file to null after successful upload if not needed
                }
            }));


            setSuccess(`${docData.doc_type} uploaded successfully!`);
            return true; // Indicate success

        } catch (err) {
            console.error(`Error uploading ${docData.doc_type}:`, err);
            setError(`Failed to upload ${docData.doc_type}. Please try again.`);
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };


  const handleUpload = async () => {
      // This function is now primarily for saving the user's basic data (PAN/Aadhaar numbers)
      // and then potentially navigating.
      // Individual document uploads happen when a file is selected in simulateDocumentScan.

      setLoading(true);
      setError(null);
      setSuccess(null);

      // First, save the PAN/Aadhaar numbers to the backend
      // Assuming the backend has an endpoint to save user basic data
      try {
           // You might only want to send the fields that have changed
           const basicDataToSave = {
               pan: docNumbers.pan_no, // Send as 'pan' as per model
               aadhaar: docNumbers.aadhaar_no // Send as 'aadhaar' as per model
           };

           const response = await fetch(`${API_BASE_URL}/user-data/${applicationId}`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("token")}` // Example auth header
               },
               body: JSON.stringify(basicDataToSave),
           });

           const result = await response.json();

           if (!response.ok) {
               throw new Error(result.message || 'Failed to save user data');
           }

            // Basic data saved successfully.
            // Now, check if required documents are uploaded before navigating.
            const requiredDocsUploaded = documentTypes
                                        .filter(doc => doc.required)
                                        .every(doc => uploadedFiles[doc.key] !== null);

            if (requiredDocsUploaded) {
                 setSuccess("Application data saved and documents verified!");
                 setTimeout(() => {
                     navigate('/MyApplication'); // Navigate on success
                 }, 2000);
            } else {
                 // This state should ideally not be reachable if the button is disabled
                 // based on isPanAadhaarUploaded, but adding a check anyway.
                 setError("Please upload all required documents.");
            }


      } catch (err) {
          console.error("Error saving user data:", err);
          setError("Failed to save application data. Please try again.");
      } finally {
          setLoading(false);
      }

      // Note: The actual file uploads are now triggered by the file input change (simulateDocumentScan),
      // which internally calls uploadSingleDocument (if you choose to upload immediately after scanning).
      // The handleUpload button can be repurposed to just save basic data and navigate.
      // OR, handleUpload could iterate through all uploadedFiles and call uploadSingleDocument for each,
      // but the current flow seems to imply per-document scanning/upload. Let's refine the upload flow.
  };

    // Refined simulateDocumentScan to call uploadSingleDocument AFTER scanning simulation
    const simulateDocumentScanAndUpload = async (docType, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Step 1: Show scanner and scanning effect
        setShowScanner(true);
        setScanningEffect(true);
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success

        // Step 2: Simulate scanning delay
        setTimeout(async () => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const docNumber = docType === 'PAN CARD' ? docNumbers.pan_no :
                                  docType === 'AADHAAR CARD' ? docNumbers.aadhaar_no :
                                  generateDocNumber(docType);

                // Temporarily update state for immediate preview
                 setUploadedFiles(prev => ({
                    ...prev,
                    [docType]: {
                      file: file, // Store the actual File object temporarily
                      preview: event.target.result, // Data URL preview
                      doc_type: docType,
                      doc_no: docNumber,
                      created_at: new Date().toISOString() // Client-side timestamp
                    }
                }));


                setScanningEffect(false); // End scanning effect
                // Step 3: Simulate verification completion delay and THEN upload
                setTimeout(async () => {
                    setShowScanner(false); // Hide scanner overlay

                    // --- Perform the actual upload to backend ---
                    const uploadSuccessful = await uploadSingleDocument({
                         applicationId: applicationId, // Pass the application ID
                         doc_type: docType,
                         doc_no: docNumber, // Use the generated/entered number
                         file: file // Pass the File object
                    });

                    if (uploadSuccessful) {
                         // Move to the next step only if upload was successful
                        const currentIndex = documentTypes.findIndex(doc => doc.key === docType);
                        if (currentIndex < documentTypes.length - 1) {
                          setActiveStep(currentIndex + 1);
                        }
                         // Optionally, clear the temporary file object from state after successful upload
                         setUploadedFiles(prev => ({
                            ...prev,
                            [docType]: {
                                ...prev[docType],
                                file: null // Clear the temporary file object
                            }
                         }));
                    } else {
                        // If upload failed, stay on the current step and show error
                        // The uploadSingleDocument function already sets the error message
                         // Reset the temporary preview on failure if desired
                         setUploadedFiles(prev => ({
                            ...prev,
                            [docType]: null // Clear the failed upload preview
                         }));
                    }

                }, 1000); // Duration for verification complete state + upload
            };
             reader.onerror = (err) => {
                console.error("FileReader error:", err);
                 setError("Failed to read file for preview.");
                 setShowScanner(false);
                 setScanningEffect(false);
            };
            reader.readAsDataURL(file); // Read file as data URL for preview

        }, 2000); // Duration for scanning effect
    };

    // Check if at least one required document (PAN or Aadhaar) is uploaded based on the 'documents' state from backend
    const isRequiredDocsUploaded = documentTypes
                                    .filter(doc => doc.required)
                                    .every(doc => documents.some(uploadedDoc => uploadedDoc.doc_type === doc.key));


  const getDocumentStatus = (docType) => {
    // Check if the document type exists in the 'documents' state fetched from the backend
    return documents.some(doc => doc.doc_type === docType);
  };

   const getOverallProgress = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required).length;
    const uploadedRequiredDocs = documents.filter(doc => documentTypes.find(d => d.key === doc.doc_type)?.required).length;
    // Ensure division by zero is avoided
    return requiredDocs > 0 ? Math.round((uploadedRequiredDocs / requiredDocs) * 100) : 100;
  };


  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'id-card':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case 'fingerprint':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        );
      case 'document-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'camera':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };


  // Theme-based classes
  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-gray-900 overflow-hidden";

  const cardClass = isDarkMode
    ? "max-w-5xl mx-auto relative z-10"
    : "max-w-5xl mx-auto relative z-10";

  // Find the document object from the fetched documents state for preview
  const uploadedDocData = documents.find(doc => doc.doc_type === documentTypes[activeStep].key);
   // Or use the temporary uploadedFiles state if you want to show the preview immediately after file selection before backend confirms
  const currentDocumentPreview = uploadedFiles[documentTypes[activeStep].key];


  return (
    <div className={containerClass}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={isDarkMode
          ? "absolute -top-10 -right-10 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
          : "absolute -top-10 -right-10 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"}></div>
        <div className={isDarkMode
          ? "absolute top-20 right-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"
          : "absolute top-20 right-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"}></div>
        <div className={isDarkMode
          ? "absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"
          : "absolute -bottom-8 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"}></div>
      </div>
      <div className={cardClass}>
        {/* Holographic header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className={isDarkMode
            ? "text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 inline-block"
            : "text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 inline-block"}>
            Quantum Document Verification
          </h1>
          <div className={isDarkMode
            ? "mt-3 text-lg text-indigo-200 max-w-2xl mx-auto"
            : "mt-3 text-lg text-indigo-500 max-w-2xl mx-auto"}>
            Secure your application with our advanced verification system
          </div>
        </motion.div>
        {/* Main cards area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Progress card */}
            <div className={isDarkMode
              ? "backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
              : "backdrop-blur-lg bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8"}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={isDarkMode ? "text-lg font-semibold text-white" : "text-lg font-semibold text-gray-900"}>Verification Progress</h3>
                <div className="relative h-10 w-10">
                  <svg className="w-10 h-10" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0,0,0,0.1)"}
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${getOverallProgress()}, 100`}
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-semibold text-cyan-300">
                    {getOverallProgress()}%
                  </div>
                </div>
              </div>
              {/* Status indicators */}
              <div className="space-y-4">
                {documentTypes.map((doc) => (
                  <div
                    key={doc.key}
                    className="flex items-center"
                  >
                    <div
                      className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 ${
                        getDocumentStatus(doc.key)
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse'
                          : doc.required
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{doc.title}</span>
                        <span
                          className={`text-xs ${
                            getDocumentStatus(doc.key)
                              ? 'text-emerald-400'
                              : doc.required
                                ? 'text-red-400'
                                : 'text-amber-400'
                          }`}
                        >
                          {getDocumentStatus(doc.key)
                            ? 'Verified'
                            : doc.required
                              ? 'Required'
                              : 'Optional'}
                        </span>
                      </div>
                      <div className="mt-1 bg-slate-700/40 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            getDocumentStatus(doc.key)
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : 'bg-transparent'
                          }`}
                          style={{ width: getDocumentStatus(doc.key) ? '100%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Help section */}
            <div className={isDarkMode
              ? "backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg"
              : "backdrop-blur-lg bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                AI Assistance
              </h3>
              <div className={isDarkMode ? "text-indigo-200 text-sm space-y-3" : "text-gray-700 text-sm space-y-3"}>
                <p>Our quantum verification system uses advanced AI to verify your documents in real-time.</p>
                <p>For best results, ensure your documents are:</p>
                <ul className={isDarkMode ? "list-disc list-inside space-y-1 text-cyan-200" : "list-disc list-inside space-y-1 text-blue-600"}>
                  <li>Well-lit and clear images</li>
                  <li>All corners visible and readable</li>
                  <li>No glare or shadows on text</li>
                </ul>
                <button className={isDarkMode ? "mt-4 w-full py-2 bg-indigo-600/50 hover:bg-indigo-600/70 rounded-lg text-sm flex items-center justify-center backdrop-blur-sm border border-indigo-500/30 transition-colors text-white" : "mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm flex items-center justify-center transition-colors text-white"}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Tutorial
                </button>
              </div>
            </div>
          </motion.div>
          {/* Main content area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            {/* Scanner overlay */}
            {showScanner && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="relative w-full max-w-md">
                  <div className={isDarkMode ? "bg-slate-900 rounded-xl p-6 border border-indigo-500/30" : "bg-white rounded-xl p-6 border border-gray-200"}>
                    <div className="text-center mb-4">
                      <h3 className={isDarkMode ? "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500" : "text-xl font-semibold text-blue-600"}>
                        {scanningEffect ? 'Advanced Scanning' : 'Verification Complete'}
                      </h3>
                      <p className={isDarkMode ? "text-indigo-300 text-sm mt-1" : "text-gray-600 text-sm mt-1"}>
                        {scanningEffect
                          ? 'Analyzing document authenticity and extracting data...'
                          : 'Document verified and authenticated successfully!'}
                      </p>
                    </div>
                    <div className="relative h-64 bg-slate-800 rounded-lg overflow-hidden mb-6">
                      {scanningEffect ? (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-1 bg-cyan-500/30">
                              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 animate-scan"></div>
                            </div>
                          </div>
                          <div className="absolute inset-0">
                            <div className="grid grid-cols-6 grid-rows-6 gap-0.5 h-full">
                              {Array(36).fill().map((_, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm flex items-center justify-center">
                                  {i % 7 === 0 && (
                                    <div className="h-2 w-2 bg-cyan-500 rounded-full animate-ping"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm text-green-400 font-medium">Document Authentication Complete</p>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-indigo-300">
                            <div className="bg-slate-800/80 p-2 rounded">
                              <span className="block text-gray-400">Security Score</span>
                              <span className="text-green-400">98%</span>
                            </div>
                            <div className="bg-slate-800/80 p-2 rounded">
                              <span className="block text-gray-400">AI Confidence</span>
                              <span className="text-green-400">High</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Removed 'Continue' button - navigation happens automatically on success */}
                    {/* {!scanningEffect && (
                      <button
                        onClick={() => setShowScanner(false)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-colors"
                      >
                        Continue
                      </button>
                    )} */}
                     {/* Add a loading spinner or message while uploading after scan */}
                     {isLoading && !scanningEffect && (
                         <div className={isDarkMode ? "text-center text-indigo-300 text-sm mt-4" : "text-center text-gray-600 text-sm mt-4"}>
                             Uploading...
                         </div>
                     )}
                  </div>
                </div>
              </div>
            )}
            {/* Notification area */}
            <AnimatedNotification error={error} success={success} />
            {/* Main card */}
            <div className={isDarkMode
              ? "backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-lg overflow-hidden mb-8"
              : "backdrop-blur-lg bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8"}>
              {/* Tab navigation */}
              <div className={isDarkMode ? "flex overflow-x-auto scrollbar-hide py-3 px-4 gap-2 bg-slate-800/50 border-b border-white/10" : "flex overflow-x-auto scrollbar-hide py-3 px-4 gap-2 bg-gray-100 border-b border-gray-200"}>
                {documentTypes.map((doc, index) => (
                  <button
                    key={doc.key}
                    onClick={() => setActiveStep(index)}
                    className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeStep === index
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg transform scale-105'
                        : getDocumentStatus(doc.key)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isDarkMode
                            ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="mr-2 w-5 h-5">{renderIcon(doc.icon)}</span>
                    <span>{doc.title}</span>
                    {getDocumentStatus(doc.key) && (
                      <span className="ml-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {/* Document content */}
              {documentTypes.map((doc, index) => (
                <motion.div
                  key={doc.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeStep === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${activeStep === index ? 'block' : 'hidden'}`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className={isDarkMode ? "p-3 bg-gradient-to-br from-indigo-500/30 to-indigo-700/30 text-indigo-400 rounded-lg border border-indigo-500/20" : "p-3 bg-indigo-100 text-indigo-600 rounded-lg"}>
                          {renderIcon(doc.icon)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className={isDarkMode ? "text-xl font-semibold text-white" : "text-xl font-semibold text-gray-900"}>
                              {doc.title}
                            </h3>
                            {doc.required && (
                              <span className={isDarkMode ? "ml-2 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30" : "ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full"}>
                                Required
                              </span>
                            )}
                          </div>
                          <p className={isDarkMode ? "text-sm text-indigo-300 mt-1" : "text-gray-600 text-sm mt-1"}>
                            {doc.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <StatusBadge doc={doc} status={getDocumentStatus(doc.key)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column - Document data */}
                      <div>
                        {doc.hasNumber && (
                          <div className="mb-6">
                            <label className={isDarkMode ? "block text-sm font-medium text-indigo-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                              {doc.numberLabel}
                            </label>
                            <div className="relative">
                              <input
                                name={doc.numberKey}
                                placeholder={`Enter ${doc.numberLabel}`}
                                value={docNumbers[doc.numberKey]}
                                onChange={handleDocNumberChange}
                                className={isDarkMode ? "w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-indigo-400/70" : "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"}
                              />
                              <div className={isDarkMode ? "absolute right-3 top-3 text-indigo-400" : "absolute right-3 top-3 text-gray-400"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Upload section */}
                        <div className="mb-4">
                          <div className={isDarkMode ? "border-2 border-dashed border-indigo-500/40 rounded-lg p-6 text-center hover:border-indigo-500/70 transition-colors" : "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"}>
                            <input
                              type="file"
                              id={`file-upload-${doc.key}`}
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => simulateDocumentScanAndUpload(doc.key, e)} // Use the new combined function
                            />
                            {!getDocumentStatus(doc.key) ? ( // Check status from fetched documents
                              <label
                                htmlFor={`file-upload-${doc.key}`}
                                className="cursor-pointer block"
                              >
                                <div className={isDarkMode ? "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500/20 mb-4" : "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4"}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={isDarkMode ? "h-6 w-6 text-indigo-400" : "h-6 w-6 text-indigo-600"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                </div>
                                <span className={isDarkMode ? "block text-sm font-medium text-indigo-300" : "block text-sm font-medium text-gray-700"}>
                                  Upload {doc.title}
                                </span>
                                <span className={isDarkMode ? "mt-2 block text-xs text-indigo-400" : "mt-2 block text-xs text-gray-500"}>
                                  PNG, JPG, or PDF up to 5MB
                                </span>
                              </label>
                            ) : (
                              <div className="text-center">
                                <div className="inline-block bg-green-500/20 rounded-full p-2 mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className={isDarkMode ? "text-sm text-green-400" : "text-sm text-green-700"}>
                                  Document Uploaded Successfully
                                </p>
                                {/* Option to re-upload - clears the state and allows new file selection */}
                                <button
                                  onClick={() => {
                                    // To remove a document, you would typically call a backend API DELETE endpoint
                                    // For this demo, we'll just clear the local state for re-upload
                                    setDocuments(prevDocs => prevDocs.filter(d => d.doc_type !== doc.key));
                                     setUploadedFiles(prev => ({
                                         ...prev,
                                         [doc.key]: null // Also clear temporary preview
                                     }));
                                  }}
                                  className={isDarkMode ? "mt-2 text-xs text-indigo-400 hover:text-indigo-300" : "mt-2 text-xs text-indigo-600 hover:text-indigo-800"}
                                >
                                  Remove and Upload Again
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Right column - Document preview */}
                      <div>
                        <div className={isDarkMode ? "rounded-lg overflow-hidden border border-indigo-500/30 bg-slate-800/50 h-64 flex items-center justify-center relative" : "rounded-lg overflow-hidden border border-gray-300 bg-gray-100 h-64 flex items-center justify-center relative"}>
                           {/* Use currentDocumentPreview (from uploadedFiles temp state) for immediate feedback */}
                          {currentDocumentPreview ? (
                            <div className="relative w-full h-full">
                              {/* Check if it's a PDF or Image for rendering */}
                               {currentDocumentPreview.preview && currentDocumentPreview.preview.startsWith('data:image/') ? (
                                  <img
                                    src={currentDocumentPreview.preview}
                                    alt={`Preview of ${doc.title}`}
                                    className="object-contain w-full h-full p-2"
                                  />
                              ) : currentDocumentPreview.preview && currentDocumentPreview.preview.startsWith('data:application/pdf') ? (
                                   // For PDF previews, you might embed a PDF viewer or link to the file
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        PDF preview not available in this demo.
                                        {/* <a href={currentDocumentPreview.preview} target="_blank" rel="noopener noreferrer" className="underline text-indigo-400 hover:text-indigo-300">View PDF</a> */}
                                    </div>
                              ) : (
                                  <div className={isDarkMode ? "text-center p-6 text-indigo-300" : "text-center p-6 text-gray-500"}>
                                       Unsupported file type preview.
                                  </div>
                              )}

                              {/* Verification overlay */}
                               {getDocumentStatus(doc.key) && ( // Only show overlay if actually verified by backend
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col items-center justify-end p-4">
                                    <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-xs font-medium flex items-center mb-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      Verified with QuantumScan™
                                    </div>
                                    <div className={isDarkMode ? "w-full bg-slate-800/80 rounded-lg p-2 text-xs" : "w-full bg-gray-200 rounded-lg p-2 text-xs"}>
                                      <div className="flex justify-between mb-1">
                                        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Document Number:</span>
                                         {/* Display doc_no from the fetched 'documents' state if available, fallback to temporary */}
                                        <span className={isDarkMode ? "text-cyan-400" : "text-indigo-600"}>
                                            {uploadedDocData?.doc_no || currentDocumentPreview.doc_no}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Verified On:</span>
                                        {/* Display created_at from the fetched 'documents' state if available */}
                                        <span className={isDarkMode ? "text-cyan-400" : "text-indigo-600"}>
                                          {uploadedDocData?.created_at ? new Date(uploadedDocData.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="text-center p-6">
                              <div className={isDarkMode ? "w-16 h-16 rounded-full bg-indigo-500/20 mx-auto flex items-center justify-center mb-3" : "w-16 h-16 rounded-full bg-indigo-100 mx-auto flex items-center justify-center mb-3"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={isDarkMode ? "h-8 w-8 text-indigo-400" : "h-8 w-8 text-indigo-600"} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className={isDarkMode ? "text-indigo-300 text-sm" : "text-gray-600 text-sm"}>
                                Document preview will appear here
                              </p>
                            </div>
                          )}
                        </div>
                        {getDocumentStatus(doc.key) && ( // Only show AI verification message if actually verified
                          <div className={isDarkMode ? "mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3" : "mt-4 bg-green-100 border border-green-300 rounded-lg p-3"}>
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h4 className={isDarkMode ? "text-sm font-medium text-green-400" : "text-sm font-medium text-green-800"}>
                                  AI Verification Successful
                                </h4>
                                <p className={isDarkMode ? "mt-1 text-xs text-green-300" : "mt-1 text-xs text-green-700"}>
                                  This document has passed our authenticity checks and meets all requirements for the application process.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Navigation buttons */}
                  <div className={isDarkMode ? "px-6 py-4 bg-slate-800/50 border-t border-white/10 flex justify-between" : "px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-between"}>
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0 || isLoading}
                      className={`px-4 py-2 rounded-md text-sm flex items-center ${
                        activeStep === 0 || isLoading
                          ? isDarkMode ? 'bg-slate-700/50 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600 transition-colors' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    {activeStep < documentTypes.length - 1 ? (
                      <button
                        onClick={() => {
                           // Allow moving next if the current required doc is uploaded or if it's an optional doc
                          if ((doc.required && getDocumentStatus(doc.key)) || !doc.required) {
                            setActiveStep(Math.min(documentTypes.length - 1, activeStep + 1));
                          }
                        }}
                        disabled={isLoading || (doc.required && !getDocumentStatus(doc.key))} // Disable if loading or required doc is not uploaded
                        className={`px-4 py-2 rounded-md text-sm flex items-center ${
                          isLoading || (doc.required && !getDocumentStatus(doc.key))
                            ? isDarkMode ? 'bg-indigo-500/50 text-indigo-300 cursor-not-allowed' : 'bg-indigo-300 text-indigo-100 cursor-not-allowed'
                            : isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700 transition-colors' : 'bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'
                        }`}
                      >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ) : (
                      // This button triggers saving basic data and navigating
                      <button
                        onClick={handleUpload}
                         // Disable if loading or required docs (PAN/Aadhaar) are not uploaded
                        disabled={isLoading || !isRequiredDocsUploaded}
                        className={`px-4 py-2 rounded-md text-sm flex items-center ${
                          isLoading || !isRequiredDocsUploaded
                            ? isDarkMode ? 'bg-indigo-500/50 text-indigo-300 cursor-not-allowed' : 'bg-indigo-300 text-indigo-100 cursor-not-allowed'
                            : isDarkMode ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-colors' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-colors'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit All Documents
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Ensure Helper Components are exported if in separate files, or included here.
// export { AnimatedNotification, StatusBadge }; // If in separate files

export default UserDocuments;