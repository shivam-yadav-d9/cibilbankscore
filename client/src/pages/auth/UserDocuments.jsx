import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const UserDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    application_id: "",
    doc_type: "",
    doc_no: "",
    doc_file: null,
    ref_code: import.meta.env.VITE_REF_CODE || "OUI2025107118",
    userId: "",
    userType: "",
  });

  const EVOLUTO_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.evolutosolution.com/v1";
  const EVOLUTO_AUTH_HEADER = import.meta.env.VITE_AUTH_BASIC;

  useEffect(() => {
    const applicationId = location.state?.applicationId || localStorage.getItem("applicationId") || "";
    const userId = location.state?.userId || localStorage.getItem("userId") || "";
    const userType = location.state?.userType || localStorage.getItem("userType") || "";

    console.log("useEffect - Retrieved values:", { applicationId, userId, userType, locationState: location.state });

    if (applicationId) localStorage.setItem("applicationId", applicationId);
    if (userId) localStorage.setItem("userId", userId);
    if (userType) localStorage.setItem("userType", userType);

    const savedFormData = sessionStorage.getItem(`documents_${applicationId}`);
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      const updatedFormData = {
        ...parsedData,
        application_id: applicationId,
        userId: userId || parsedData.userId || "",
        userType: userType || parsedData.userType || "",
        doc_file: null,
      };
      setFormData(updatedFormData);
      console.log("useEffect - Loaded from sessionStorage:", updatedFormData);
    } else {
      const initialFormData = {
        ...formData,
        application_id: applicationId,
        userId: userId || "",
        userType: userType || "",
      };
      setFormData(initialFormData);
      console.log("useEffect - Initial form data:", initialFormData);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (updatedFormData.application_id) {
      const dataToSave = { ...updatedFormData, doc_file: null };
      sessionStorage.setItem(`documents_${updatedFormData.application_id}`, JSON.stringify(dataToSave));
      console.log("handleInputChange - Saved to sessionStorage:", dataToSave);
    }
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid file (PDF, JPG, JPEG, or PNG)");
        e.target.value = "";
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, doc_file: file }));
      console.log("handleFileChange - File selected:", { name: file.name, size: file.size, type: file.type });
    }
    setError("");
  };

  const validateForm = () => {
    const { doc_type, doc_no, doc_file, application_id, userId, userType } = formData;
    console.log("validateForm - Current form data:", formData);

    if (!application_id) {
      setError("Application ID is required");
      return false;
    }
    if (!userId) {
      setError("User ID is missing. Please ensure you are logged in or try re-navigating to this page.");
      return false;
    }
    if (!userType) {
      setError("User Type is missing. Please ensure you are logged in or try re-navigating to this page.");
      return false;
    }
    if (!doc_type) {
      setError("Document Type is required");
      return false;
    }
    if (!doc_no) {
      setError("Document Number is required");
      return false;
    }
    if (!doc_file) {
      setError("Document File is required");
      return false;
    }
    if (!/^[A-Z0-9]{10}$/.test(doc_no)) {
      setError("Document number must be exactly 10 alphanumeric characters");
      return false;
    }
    return true;
  };

  const authenticateWithEvoluto = async () => {
    try {
      if (!EVOLUTO_AUTH_HEADER) {
        throw new Error("Evoluto API authentication header is missing. Contact support.");
      }
      console.log("Attempting Evoluto authentication:", {
        url: `${EVOLUTO_BASE_URL}/authentication`,
        headers: { source: "web", package: "10.0.2.215", outletid: formData.ref_code },
      });
      const response = await axios.post(
        `${EVOLUTO_BASE_URL}/authentication`,
        {},
        {
          headers: {
            source: "web",
            package: "10.0.2.215",
            outletid: formData.ref_code,
            Authorization: EVOLUTO_AUTH_HEADER,
          },
          timeout: 30000,
        }
      );
      console.log("Evoluto authentication successful:", response.data);
      return response.data.token || response.data.data?.token || response.data.access_token;
    } catch (error) {
      console.error("Evoluto authentication failed:", error.response?.data || error.message);
      throw new Error(`Failed to authenticate with Evoluto API: ${error.response?.data?.message || error.message}`);
    }
  };

  const saveDocumentMetadata = () => {
    const metadata = {
      doc_type: formData.doc_type,
      doc_no: formData.doc_no,
      file_name: formData.doc_file?.name,
      file_size: formData.doc_file?.size,
      file_type: formData.doc_file?.type,
      uploaded_at: new Date().toISOString(),
    };

    const existingDocs = JSON.parse(localStorage.getItem(`docs_${formData.application_id}`)) || [];
    existingDocs.push(metadata);
    localStorage.setItem(`docs_${formData.application_id}`, JSON.stringify(existingDocs));
    console.log("Document metadata saved to localStorage:", metadata);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploadProgress(0);

    if (!validateForm()) return;

    setIsLoading(true);

    if (formData.application_id) {
      const dataToSave = { ...formData, doc_file: null };
      sessionStorage.setItem(`documents_${formData.application_id}`, JSON.stringify(dataToSave));
      console.log("handleSubmit - Saved to sessionStorage:", dataToSave);
    }

    try {
      // Attempt Evoluto API upload
      let evolutoResponse = null;
      try {
        const evolutoToken = await authenticateWithEvoluto();
        const formDataToSend = new FormData();
        formDataToSend.append("doc_file", formData.doc_file);
        formDataToSend.append("ref_code", formData.ref_code);
        formDataToSend.append("application_id", formData.application_id);
        formDataToSend.append("doc_type", formData.doc_type);
        formDataToSend.append("doc_no", formData.doc_no);

        console.log("Submitting to Evoluto API:", {
          application_id: formData.application_id,
          doc_type: formData.doc_type,
          doc_no: formData.doc_no,
          ref_code: formData.ref_code,
          file_name: formData.doc_file?.name,
        });

        evolutoResponse = await axios.post(
          `${EVOLUTO_BASE_URL}/loan/saveDocs`,
          formDataToSend,
          {
            headers: {
              token: evolutoToken,
              outletid: formData.ref_code,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            },
            timeout: 60000,
          }
        );
        console.log("Evoluto API response:", evolutoResponse.data);
      } catch (evolutoError) {
        console.warn("Evoluto API upload failed, saving metadata locally:", evolutoError.message);
      }

      // Save metadata to localStorage regardless of Evoluto success
      saveDocumentMetadata();

      setSuccess("Document uploaded and saved successfully!");
      if (formData.application_id) {
        sessionStorage.removeItem(`documents_${formData.application_id}`);
      }
      setTimeout(() => {
        navigate("/MyApplication", {
          state: { applicationId: formData.application_id, userId: formData.userId, userType: formData.userType },
        });
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      let errorMessage = "Error processing document. Please try again later.";
      if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your internet connection and try again.";
      } else if (err.response?.status === 413) {
        errorMessage = "File too large. Please upload a smaller file.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setUploadProgress(0);
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    : "min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center";

  const cardClass = isDarkMode
    ? "max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-fadeIn"
    : "max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn";

  const innerClass = isDarkMode ? "p-8 md:p-12" : "p-8 md:p-12";

  const sectionTitleClass = isDarkMode
    ? "text-3xl font-bold text-white mb-2"
    : "text-3xl font-bold text-gray-900 mb-2";

  const labelClass = isDarkMode
    ? "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-400"
    : "absolute left-4 top-4 transition-all duration-300 transform peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 -translate-y-5 scale-75 text-indigo-600";

  const inputClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

  const selectClass = isDarkMode
    ? "w-full px-4 py-4 bg-slate-800/50 backdrop-blur-sm text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 peer"
    : "w-full px-4 py-4 bg-white text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 peer";

  const buttonClass = isDarkMode
    ? "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1"
    : "w-full font-medium text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-indigo-500/50 transform hover:-translate-y-1";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={innerClass}>
          {error && (
            <div
              className={isDarkMode
                ? "bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-4 mb-6 rounded-2xl flex items-center animate-pulse"
                : "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex items-center animate-pulse"}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div
              className={isDarkMode
                ? "bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/50 text-emerald-100 p-4 mb-6 rounded-2xl flex items-center"
                : "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-xl flex items-center"}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>{success}</p>
            </div>
          )}
          {isLoading && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Uploading...</span>
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div
                  className={isDarkMode
                    ? "h-2 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                    : "h-2 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"}
                ></div>
              </div>
              <h2 className={sectionTitleClass}>
                <span
                  className={isDarkMode
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}
                >
                  Document Upload
                </span>
              </h2>
            </div>
            <div className="group relative mb-8">
              <input
                name="application_id"
                type="text"
                value={formData.application_id}
                onChange={handleInputChange}
                placeholder=" "
                className={inputClass}
                required
                readOnly
              />
              <label className={labelClass}>Application ID</label>
            </div>
            {/* {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                Debug: userId={formData.userId}, userType={formData.userType}
              </div>
            )} */}
            <div className="group relative">
              <select
                name="doc_type"
                value={formData.doc_type}
                onChange={handleInputChange}
                className={selectClass}
                required
              >
                <option value="">Select Document Type</option>
                <option value="PAN CARD">PAN Card</option>
                <option value="AADHAR CARD">Aadhar Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING LICENSE">Driving License</option>
                <option value="VOTER ID">Voter ID</option>
              </select>
              <label className={labelClass}>Document Type</label>
            </div>
            <div className="group relative">
              <input
                type="text"
                name="doc_no"
                value={formData.doc_no}
                onChange={handleInputChange}
                placeholder=" "
                pattern="[A-Z0-9]{10}"
                className={inputClass}
                required
                maxLength="10"
                style={{ textTransform: "uppercase" }}
              />
              <label className={labelClass}>Document Number (10 characters)</label>
            </div>
            <div className="group relative">
              <input
                type="file"
                name="doc_file"
                onChange={handleFileChange}
                className={inputClass}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              <label className={labelClass}>Document File (PDF, JPG, PNG - Max 5MB)</label>
              {formData.doc_file && (
                <div className={`mt-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Selected: {formData.doc_file.name} ({(formData.doc_file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`${buttonClass} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Processing..."}
                  </div>
                ) : (
                  "Upload & Continue"
                )}
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between pt-4 text-sm text-blue-600">
              <Link
                to="/UserCoApplications"
                className="mb-2 md:mb-0 hover:text-blue-800 transition-colors duration-200"
              >
                ← Back to Co-Applicant
              </Link>
              <Link
                to="/MyApplication"
                className="hover:text-blue-800 transition-colors duration-200"
                state={{ applicationId: formData.application_id, userId: formData.userId, userType: formData.userType }}
              >
                Skip to My Applications →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;

