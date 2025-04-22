import React, { useState } from 'react';
import { Phone, Send } from 'lucide-react';

const ExpertConnect = ({ user, onClose, onSubmit }) => {
  const [complaintText, setComplaintText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const supportPhone = "1-800-123-4567";
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      onSubmit({
        userId: user.id,
        userName: user.name,
        complaintText,
        timestamp: new Date().toISOString()
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };
  
  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={24} />
          </div>
          <h2 className="text-xl font-medium mb-2">Complaint Submitted</h2>
          <p className="text-gray-600">Thank you for your feedback. Our support team will review your complaint shortly.</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
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
      
      <form onSubmit={handleSubmit}>
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
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !complaintText.trim()}
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