import React from 'react';

const SidebarLink = ({ icon, title, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-2 w-full p-3 hover:bg-gray-700 transition-colors ${active ? 'bg-gray-700' : ''}`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

export default SidebarLink;