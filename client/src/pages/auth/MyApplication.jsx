import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyApplication() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const applicationId = localStorage.getItem("applicationId");

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
    
    // Get documents from localStorage
    const savedDocs = localStorage.getItem(`documents_${applicationId}`);
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, [navigate, applicationId]);

  const getDocumentStatus = (docType) => {
    return documents.some(doc => doc.doc_type === docType);
  };

  const getDocumentPreview = (docType) => {
    const doc = documents.find(doc => doc.doc_type === docType);
    return doc ? doc.file_data : null;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl mt-16 mb-16 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          My Application
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600">
            <span className="font-semibold">Application ID:</span> {applicationId}
          </p>
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
        
        <div className="space-y-4">
          {/* Document List */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 text-sm font-medium text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Document Type</div>
              <div className="col-span-2">Document Number</div>
              <div className="col-span-4">Preview</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <div key={doc.id || index} className="grid grid-cols-12 py-4 px-4 border-t border-gray-200 items-center">
                  <div className="col-span-1 font-medium text-gray-800">{index + 1}</div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{doc.doc_type}</span>
                    </div>
                  </div>
                  <div className="col-span-2 font-mono text-sm">
                    {doc.doc_no !== 'NA' ? doc.doc_no : '-'}
                  </div>
                  <div className="col-span-4">
                    {doc.file_data && (
                      <img 
                        src={doc.file_data} 
                        alt={doc.doc_type}
                        className="h-16 w-24 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => navigate('/UserDocuments')}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No documents have been uploaded yet. 
                <button 
                  onClick={() => navigate('/UserDocuments')} 
                  className="text-blue-600 hover:underline ml-1"
                >
                  Upload documents
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Document Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* PAN Card Status */}
          <div className={`p-4 rounded-lg border ${getDocumentStatus('PAN CARD') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center mb-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${getDocumentStatus('PAN CARD') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {getDocumentStatus('PAN CARD') ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <h4 className="ml-2 font-medium">PAN Card</h4>
            </div>
            {getDocumentPreview('PAN CARD') && (
              <img 
                src={getDocumentPreview('PAN CARD')} 
                alt="PAN Card"
                className="w-full h-20 object-cover rounded mt-2"
              />
            )}
            <p className={`text-sm mt-2 ${getDocumentStatus('PAN CARD') ? 'text-green-600' : 'text-red-600'}`}>
              {getDocumentStatus('PAN CARD') ? 'Uploaded' : 'Not uploaded'}
            </p>
          </div>

          {/* Aadhaar Card Status */}
          <div className={`p-4 rounded-lg border ${getDocumentStatus('AADHAAR CARD') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center mb-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${getDocumentStatus('AADHAAR CARD') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {getDocumentStatus('AADHAAR CARD') ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <h4 className="ml-2 font-medium">Aadhaar Card</h4>
            </div>
            {getDocumentPreview('AADHAAR CARD') && (
              <img 
                src={getDocumentPreview('AADHAAR CARD')} 
                alt="Aadhaar Card"
                className="w-full h-20 object-cover rounded mt-2"
              />
            )}
            <p className={`text-sm mt-2 ${getDocumentStatus('AADHAAR CARD') ? 'text-green-600' : 'text-red-600'}`}>
              {getDocumentStatus('AADHAAR CARD') ? 'Uploaded' : 'Not uploaded'}
            </p>
          </div>

          {/* Income Proof Status */}
          <div className={`p-4 rounded-lg border ${getDocumentStatus('INCOME PROOF') ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center mb-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${getDocumentStatus('INCOME PROOF') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {getDocumentStatus('INCOME PROOF') ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              <h4 className="ml-2 font-medium">Income Proof</h4>
            </div>
            {getDocumentPreview('INCOME PROOF') && (
              <img 
                src={getDocumentPreview('INCOME PROOF')} 
                alt="Income Proof"
                className="w-full h-20 object-cover rounded mt-2"
              />
            )}
            <p className={`text-sm mt-2 ${getDocumentStatus('INCOME PROOF') ? 'text-green-600' : 'text-yellow-600'}`}>
              {getDocumentStatus('INCOME PROOF') ? 'Uploaded' : 'Optional'}
            </p>
          </div>

          {/* Photograph Status */}
          <div className={`p-4 rounded-lg border ${getDocumentStatus('PHOTOGRAPH') ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center mb-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${getDocumentStatus('PHOTOGRAPH') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {getDocumentStatus('PHOTOGRAPH') ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              <h4 className="ml-2 font-medium">Photograph</h4>
            </div>
            {getDocumentPreview('PHOTOGRAPH') && (
              <img 
                src={getDocumentPreview('PHOTOGRAPH')} 
                alt="Photograph"
                className="w-full h-20 object-cover rounded mt-2"
              />
            )}
            <p className={`text-sm mt-2 ${getDocumentStatus('PHOTOGRAPH') ? 'text-green-600' : 'text-yellow-600'}`}>
              {getDocumentStatus('PHOTOGRAPH') ? 'Uploaded' : 'Optional'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex justify-center space-x-4">
        <button
          onClick={() => navigate("/UserDocuments")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-lg transition-colors duration-200"
        >
          Upload More Documents
        </button>
      </div>
    </div>
  );
}

export default MyApplication;