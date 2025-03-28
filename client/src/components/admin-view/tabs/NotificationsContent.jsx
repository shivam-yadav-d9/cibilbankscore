import React, { useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// const socket = io('https://cibilbankscore-server-gamma.vercel.app//');


// Connect to socket server
const socket = io('https://cibilbankscore-server-gamma.vercel.app', {
  transports: ['websocket', 'polling'], // ✅ Ensure transport compatibility
  withCredentials: true // ✅ Fix potential CORS issues
});

function NotificationsContent() {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message || !sender) {
      setStatus('Please fill in all fields');
      return;
    }
    
    try {
      // Send to API
      await axios.post('https://cibilbankscore-server-gamma.vercel.app/api/messages', {
        content: message,
        sender
      });
      
      // Emit socket event
      socket.emit('new_message', {
        content: message,
        sender
      });
      
      // Reset form
      setMessage('');
      setStatus('Message sent successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);
      
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Broadcast Message</h2>
        <p className="text-sm text-gray-500">Send notifications to all connected users</p>
      </div>
      
      {status && (
        <div className={`mb-6 p-4 rounded-md ${
          status.includes('Error') 
            ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
            : 'bg-green-50 text-green-700 border-l-4 border-green-500'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {status.includes('Error') ? (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{status}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="sender" className="block text-sm font-medium text-gray-700 mb-1">
            Sender Name
          </label>
          <input 
            type="text" 
            id="sender" 
            value={sender} 
            onChange={(e) => setSender(e.target.value)}
            placeholder="Admin Notification"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message Content
          </label>
          <textarea 
            id="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your notification message here..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button 
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Broadcast Message
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotificationsContent;