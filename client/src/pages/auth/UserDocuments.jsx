import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDocuments() {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId || localStorage.getItem("applicationId");
  
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documents, setDocuments] = useState([]);
  
  const [uploadedFiles, setUploadedFiles] = useState({
    'PAN CARD': null,
    'AADHAAR CARD': null,
    'INCOME PROOF': null,
    'PHOTOGRAPH': null
  });

  const [docNumbers, setDocNumbers] = useState({
    pan_no: "",
    aadhaar_no: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (!applicationId) {
      navigate("/UserBasicData");
      return;
    }

    // Load existing documents from localStorage
    const savedDocs = localStorage.getItem(`documents_${applicationId}`);
    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs);
      setDocuments(parsedDocs);
      
      // Set uploaded status based on saved documents
      const updatedFiles = { ...uploadedFiles };
      parsedDocs.forEach(doc => {
        updatedFiles[doc.doc_type] = {
          preview: doc.file_data,
          doc_type: doc.doc_type,
          doc_no: doc.doc_no,
          created_at: doc.created_at
        };
      });
      setUploadedFiles(updatedFiles);
    }

    // Load document numbers from localStorage
    const userData = localStorage.getItem("userBasicData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setDocNumbers({
        pan_no: parsedData.pan || "",
        aadhaar_no: parsedData.aadhaar || ""
      });
    }
  }, [navigate, applicationId]);

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setUploadedFiles(prev => ({
          ...prev,
          [docType]: {
            file: file,
            preview: event.target.result,
            doc_type: docType,
            doc_no: docType === 'PAN CARD' ? docNumbers.pan_no : 
                   docType === 'AADHAAR CARD' ? docNumbers.aadhaar_no :
                   generateDocNumber(docType),
            created_at: new Date().toISOString()
          }
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const generateDocNumber = (docType) => {
    switch (docType) {
      case 'PAN CARD':
        return docNumbers.pan_no || ('PAN' + Math.random().toString(36).substr(2, 8).toUpperCase());
      case 'AADHAAR CARD':
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
  };

  const handleUpload = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert uploadedFiles object to array and filter out null values
      const newDocuments = Object.values(uploadedFiles)
        .filter(doc => doc !== null)
        .map((doc, index) => ({
          id: index + 1,
          doc_type: doc.doc_type,
          doc_no: doc.doc_type === 'PAN CARD' ? docNumbers.pan_no : 
                 doc.doc_type === 'AADHAAR CARD' ? docNumbers.aadhaar_no :
                 doc.doc_no,
          created_at: doc.created_at,
          file_data: doc.preview
        }));

      // Save to localStorage
      localStorage.setItem(`documents_${applicationId}`, JSON.stringify(newDocuments));
      setDocuments(newDocuments);
      setSuccess("Documents saved successfully!");

      // Navigate after a short delay
      setTimeout(() => {
        navigate('/MyApplication');
      }, 1500);
    } catch (error) {
      setError("Failed to save documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (docType) => {
    return uploadedFiles[docType] !== null;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl mt-16 mb-16 border border-gray-100">
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
        Upload Documents
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg">
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* PAN Card Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              PAN Card <span className="text-red-500">*</span>
            </h3>
            <span className={`text-sm ${getDocumentStatus('PAN CARD') ? 'text-green-600' : 'text-red-500'}`}>
              {getDocumentStatus('PAN CARD') ? 'Uploaded' : 'Not uploaded'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                PAN Number
              </label>
              <input
                name="pan_no"
                placeholder="Enter PAN Number"
                value={docNumbers.pan_no}
                onChange={handleDocNumberChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              {uploadedFiles['PAN CARD']?.preview ? (
                <div className="space-y-4">
                  <img 
                    src={uploadedFiles['PAN CARD'].preview}
                    alt="PAN Card"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedFiles(prev => ({ ...prev, 'PAN CARD': null }))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('PAN CARD', e)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aadhaar Card Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Aadhaar Card <span className="text-red-500">*</span>
            </h3>
            <span className={`text-sm ${getDocumentStatus('AADHAAR CARD') ? 'text-green-600' : 'text-red-500'}`}>
              {getDocumentStatus('AADHAAR CARD') ? 'Uploaded' : 'Not uploaded'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                Aadhaar Number
              </label>
              <input
                name="aadhaar_no"
                placeholder="Enter Aadhaar Number"
                value={docNumbers.aadhaar_no}
                onChange={handleDocNumberChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              {uploadedFiles['AADHAAR CARD']?.preview ? (
                <div className="space-y-4">
                  <img 
                    src={uploadedFiles['AADHAAR CARD'].preview}
                    alt="Aadhaar Card"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedFiles(prev => ({ ...prev, 'AADHAAR CARD': null }))}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('AADHAAR CARD', e)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Income Proof Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Income Proof</h3>
            <span className={`text-sm ${getDocumentStatus('INCOME PROOF') ? 'text-green-600' : 'text-yellow-600'}`}>
              {getDocumentStatus('INCOME PROOF') ? 'Uploaded' : 'Optional'}
            </span>
          </div>

          <div className="space-y-4">
            {uploadedFiles['INCOME PROOF']?.preview ? (
              <div className="space-y-4">
                <img 
                  src={uploadedFiles['INCOME PROOF'].preview}
                  alt="Income Proof"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setUploadedFiles(prev => ({ ...prev, 'INCOME PROOF': null }))}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('INCOME PROOF', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Photograph Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Photograph</h3>
            <span className={`text-sm ${getDocumentStatus('PHOTOGRAPH') ? 'text-green-600' : 'text-yellow-600'}`}>
              {getDocumentStatus('PHOTOGRAPH') ? 'Uploaded' : 'Optional'}
            </span>
          </div>

          <div className="space-y-4">
            {uploadedFiles['PHOTOGRAPH']?.preview ? (
              <div className="space-y-4">
                <img 
                  src={uploadedFiles['PHOTOGRAPH'].preview}
                  alt="Photograph"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setUploadedFiles(prev => ({ ...prev, 'PHOTOGRAPH': null }))}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('PHOTOGRAPH', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            onClick={handleUpload}
            disabled={isLoading || (!uploadedFiles['PAN CARD'] && !uploadedFiles['AADHAAR CARD'])}
            className={`w-full font-bold py-4 rounded-lg shadow-md transition-all duration-300 ${
              isLoading || (!uploadedFiles['PAN CARD'] && !uploadedFiles['AADHAAR CARD'])
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 pt-4">
          <div className="h-2 w-8 rounded-full bg-blue-600"></div>
          <div className="h-2 w-8 rounded-full bg-blue-600"></div>
          <div className="h-2 w-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

export default UserDocuments;