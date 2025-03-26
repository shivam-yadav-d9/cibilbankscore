import React, { useState } from 'react';
import { BellIcon, UserIcon, CreditCardIcon, ChartBarIcon, LogOutIcon, PlusIcon, UsersIcon, TrashIcon, EditIcon, BellRingIcon } from 'lucide-react';
import SidebarLink from './SideBarLink.jsx';
import DashboardContent from './tabs/DashboardContent';
import UsersContent from './tabs/UsersContent';
import SubscriptionsContent from './tabs/SubscriptionsContent';
import NotificationsContent from './tabs/NotificationsContent';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', subscription: 'Premium', creditScore: 680 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', subscription: 'Basic', creditScore: 710 },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', status: 'Inactive', subscription: 'None', creditScore: 650 }
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Basic', users: 124, price: '$9.99' },
    { id: 2, name: 'Premium', users: 86, price: '$19.99' },
    { id: 3, name: 'Enterprise', users: 32, price: '$49.99' }
  ]);

  const stats = {
    totalUsers: 242,
    totalSubscribers: 118,
    todayRegistered: 8,
    todaySubscribed: 3,
    avgCreditScore: 685,
    totalRevenue: '$4,328.52'
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} />;
      case 'users':
        return <UsersContent users={users} setUsers={setUsers} />;
      case 'subscriptions':
        return <SubscriptionsContent subscriptions={subscriptions} />;
      case 'notifications':
        return <NotificationsContent />;
      default:
        return <DashboardContent stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          Credit Builder Admin
        </div>
        <nav className="mt-4">
          <SidebarLink 
            icon={<ChartBarIcon size={20} />} 
            title="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarLink 
            icon={<UsersIcon size={20} />} 
            title="Users Management" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
          />
          <SidebarLink 
            icon={<CreditCardIcon size={20} />} 
            title="Subscription List" 
            active={activeTab === 'subscriptions'} 
            onClick={() => setActiveTab('subscriptions')} 
          />
          <SidebarLink 
            icon={<BellIcon size={20} />} 
            title="Notification Manage" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
          <div className="mt-8 p-4 border-t border-gray-700">
            <SidebarLink 
              icon={<LogOutIcon size={20} />} 
              title="Logout" 
              onClick={() => alert('Logged out')} 
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <BellIcon size={20} />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <span className="ml-2">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;