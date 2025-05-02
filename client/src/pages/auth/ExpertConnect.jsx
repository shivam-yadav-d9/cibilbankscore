import React, { useState } from 'react';
import { Phone, Send, X, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";

const ExpertConnect = ({ onClose }) => {
  const { isDarkMode } = useTheme();

  const [complaintText, setComplaintText] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const supportPhone = "7693004909";
  const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_URL}/api/expert-connect/submit`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINT, { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, complaintText }),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        setSubmissionStatus({
          type: 'success',
          title: 'Complaint Received',
          message: data.message || 'Thank you for reaching out. Our expert team has received your request and will contact you shortly.'
        });
        setName('');
        setMobile('');
        setComplaintText('');

      } else {
        // Handle error responses from the server
        setSubmissionStatus({
          type: 'error',
          title: 'Submission Failed',
          message: data.message || 'An error occurred while submitting. Please try again.',
        });
      }
    } catch (err) {
      console.error(err);
      setSubmissionStatus({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to the server. Please check your network and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-based classes (rest of your component remains the same)
  const bgMain = isDarkMode
    ? "bg-gradient-to-br from-slate-900 to-slate-800"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";
  const borderMain = isDarkMode ? "border-slate-700" : "border-indigo-200";
  const textMain = isDarkMode ? "text-slate-100" : "text-slate-900";
  const inputBg = isDarkMode ? "bg-slate-800/50" : "bg-white";
  const inputBorder = isDarkMode ? "border-slate-700" : "border-indigo-200";
  const inputPlaceholder = isDarkMode ? "placeholder-slate-500" : "placeholder-indigo-400";
  const labelText = isDarkMode ? "text-slate-300" : "text-indigo-700";
  const supportBg = isDarkMode ? "bg-slate-800/70" : "bg-indigo-50";
  const supportBorder = isDarkMode ? "border-slate-700" : "border-indigo-200";
  const supportText = isDarkMode ? "text-indigo-300" : "text-indigo-700";
  const supportSubText = isDarkMode ? "text-slate-400" : "text-indigo-500";
  const closeBtnBg = isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-indigo-100 hover:bg-indigo-200";
  const closeBtnIcon = isDarkMode ? "text-slate-400" : "text-indigo-400";

  return (
    <div className={isDarkMode ? "bg-slate-800" : "bg-indigo-50"}>
      <div className={`${bgMain} rounded-xl shadow-2xl p-6 max-w-md mx-auto border ${borderMain} ${textMain}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="h-6 w-1 bg-blue-500 rounded-full mr-3"></div>
            <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Expert Connect</h2>
          </div>
          <button
            onClick={onClose}
            className={`${closeBtnBg} p-2 rounded-full transition-colors duration-200`}
          >
            <X size={16} className={closeBtnIcon} />
          </button>
        </div>

        {submissionStatus && submissionStatus.type === 'success' && (
          <div className="mb-6 p-4 rounded-lg bg-blue-900/30 border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <Send className="text-blue-400" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-300">{submissionStatus.title}</h3>
                <p className="text-sm text-blue-200/80">{submissionStatus.message}</p>
              </div>
            </div>
          </div>
        )}

        {submissionStatus && submissionStatus.type === 'error' && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-red-500/20 rounded-full p-2 mr-3">
                <AlertCircle className="text-red-400" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-red-300">Error</h3>
                <p className="text-sm text-red-200/80">{submissionStatus.message}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 group">
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ml-1 ${labelText}`}>Name</label>
            <input
              id="name"
              type="text"
              className={`w-full ${inputBg} border ${inputBorder} rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${inputPlaceholder}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 group">
            <label htmlFor="mobile" className={`block text-sm font-medium mb-2 ml-1 ${labelText}`}>Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              className={`w-full ${inputBg} border ${inputBorder} rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${inputPlaceholder}`}
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 group">
            <label htmlFor="complaint" className={`block text-sm font-medium mb-2 ml-1 ${labelText}`}>
              Describe your issue
            </label>
            <textarea
              id="complaint"
              rows="4"
              className={`w-full ${inputBg} border ${inputBorder} rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${inputPlaceholder}`}
              placeholder="Please provide details about your complaint..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              required
            ></textarea>
          </div>

          <div className={`${supportBg} backdrop-blur-sm rounded-lg p-4 mb-6 border ${supportBorder}`}>
            <div className="flex items-center">
              <div className="bg-indigo-900/50 rounded-full p-2 mr-3 border border-indigo-500/30">
                <Phone className="text-indigo-400" size={16} />
              </div>
              <div>
                <p className={`text-sm font-medium ${supportText}`}>Prefer real-time assistance?</p>
                <p className={`text-sm ${supportSubText}`}>Connect with support: {supportPhone}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !complaintText.trim() || !name.trim() || !mobile.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpertConnect;