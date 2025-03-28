import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Bell, X, Check } from 'lucide-react';

const socket = io('https://cibilbankscore-server-gamma.vercel.app');

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://cibilbankscore-server-gamma.vercel.app/api/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter(notif => !notif.read).length);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notifications');
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Listen for new notifications
    socket.on('notification', (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1);
        // Play notification sound
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    });
    
    // Handle clicks outside the notification panel to close it
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      socket.off('notification');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };
  
  const markAsRead = async (id) => {
    try {
      await axios.patch(`https://cibilbankscore-server-gamma.vercel.app/api/notifications/${id}`);
      setNotifications(prev => prev.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const deleteNotification = async (id, e) => {
    // Stop the event from propagating to parent (which would trigger markAsRead)
    e.stopPropagation();
    
    try {
      await axios.delete(`https://cibilbankscore-server-gamma.vercel.app/api/notifications/${id}`);
      // Remove the deleted notification from state
      const deletedNotif = notifications.find(notif => notif._id === id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await axios.patch('https://cibilbankscore-server-gamma.vercel.app/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const clearAllNotifications = async () => {
    try {
      await axios.delete('https://cibilbankscore-server-gamma.vercel.app/api/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative" ref={notificationRef}>
      {/* Bell Icon with Badge */}
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-200 relative"
        onClick={toggleNotifications}
      >
        <Bell className="text-gray-700" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full px-1.5 shadow-md">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      
      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={markAllAsRead}
                >
                  <Check size={14} />
                  <span>Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  className="text-xs text-gray-600 hover:text-gray-800"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              )}
              <button 
                className="text-gray-500 hover:text-gray-700 ml-2"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading notifications...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-3 text-gray-400" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={notification._id || index}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => !notification.read && notification._id && markAsRead(notification._id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-800">{notification.sender}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {notification.createdAt ? formatDate(notification.createdAt) : 'Just now'}
                      </span>
                      {notification._id && (
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1"
                          onClick={(e) => deleteNotification(notification._id, e)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 break-words">{notification.message}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full absolute left-4 mt-1"></div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Footer - Optional */}
          {notifications.length > 5 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
              <button 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {}}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;