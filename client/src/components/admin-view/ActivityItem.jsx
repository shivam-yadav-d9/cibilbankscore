import React from 'react';
import { UserIcon, CreditCardIcon, BellRingIcon } from 'lucide-react';

const ActivityItem = ({ type, message, time }) => {
  let icon;
  let color;
  
  switch (type) {
    case 'signup':
      icon = <UserIcon size={16} />;
      color = 'text-blue-500';
      break;
    case 'subscription':
      icon = <CreditCardIcon size={16} />;
      color = 'text-green-500';
      break;
    case 'alert':
      icon = <BellRingIcon size={16} />;
      color = 'text-yellow-500';
      break;
    default:
      icon = <UserIcon size={16} />;
      color = 'text-gray-500';
  }

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-1 ${color}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;