import React, { useState } from 'react';
import { Phone, Send } from 'lucide-react';

const ExpertConnect = ({ onClose }) => {
  const [complaintText, setComplaintText] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // Use null for initial state

  const supportPhone = "7693004909";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/expert-connect/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, complaintText })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionStatus({
          type: 'success',
          title: 'Complaint Received',
          message: 'Thank you for Thank you for reaching out. Our support team has received your complaint and will get back to you shortly feedback. Our support team will review your complaint shortly.'
        });
        // Optionally clear the form
        setName('');
        setMobile('');
        setComplaintText('');
      } else {
        setSubmissionStatus({ type: 'error', message: data.message || 'Submission failed.' });
      }
    } catch (err) {
      console.error(err);
      setSubmissionStatus({ type: 'error', message: 'An error occurred while submitting.' });
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Expert Connect</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {submissionStatus && submissionStatus.type === 'success' && (
        <div className="mb-4 p-4 rounded-md text-sm bg-green-100 text-green-700">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3">
              <Send className="text-green-700" size={16} />
            </div>
            <div>
              <h3 className="font-semibold">{submissionStatus.title}</h3>
              <p>{submissionStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      {submissionStatus && submissionStatus.type === 'error' && (
        <div className="mb-4 p-4 rounded-md text-sm bg-red-100 text-red-700">
          <div className="flex items-center">
            <div className="bg-red-200 rounded-full p-2 mr-3">
              {/* Add an error icon here if you have one */}
              <span>!</span>
            </div>
            <div>
              <h3 className="font-semibold">Error</h3>
              <p>{submissionStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            id="mobile"
            type="tel"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-2">
            Please describe your complaint or issue
          </label>
          <textarea
            id="complaint"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please provide details about your complaint..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Phone className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">Prefer to call?</p>
              <p className="text-sm text-gray-600">Contact support at {supportPhone}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
       
          <button
            type="submit"
            disabled={submitting || !complaintText.trim() || !name.trim() || !mobile.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpertConnect;