import React from 'react';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import ActivityItem from '../ActivityItem';

const SubscriptionsContent = ({ subscriptions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Subscription Plans</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-1">
            <PlusIcon size={16} />
            <span>Add Plan</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map(sub => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EditIcon size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Subscription Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            type="subscription" 
            message="Michelle Davis upgraded to Premium" 
            time="2 hours ago" 
          />
          <ActivityItem 
            type="subscription" 
            message="James Wilson downgraded to Basic" 
            time="5 hours ago" 
          />
          <ActivityItem 
            type="subscription" 
            message="Thomas Brown cancelled subscription" 
            time="1 day ago" 
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsContent;