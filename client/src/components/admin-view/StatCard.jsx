import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;