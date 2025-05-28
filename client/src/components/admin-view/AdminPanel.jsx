import React, { useState } from "react";
import {
  BellIcon,
  UserIcon,
  CreditCardIcon,
  ChartBarIcon,
  LogOutIcon,
  UsersIcon,
  ShieldCheckIcon,
  WalletIcon, // Add this import
} from "lucide-react";
import SidebarLink from "./SideBarLink.jsx";
import DashboardContent from "./tabs/DashboardContent";
import UsersContent from "./tabs/UsersContent";
import SubscriptionsContent from "./tabs/SubscriptionsContent";
import NotificationsContent from "./tabs/NotificationsContent";
import AgentApprove from "./tabs/Agentapprove.jsx";
import WalletApprovalContent from "./tabs/WalletApprovalContent.jsx";
import BankSettingsContent from "./tabs/BankSettingsContent.jsx";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Active",
      subscription: "Premium",
      creditScore: 680,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Active",
      subscription: "Basic",
      creditScore: 710,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      status: "Inactive",
      subscription: "None",
      creditScore: 650,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: "Basic", users: 124, price: "$9.99" },
    { id: 2, name: "Premium", users: 86, price: "$19.99" },
    { id: 3, name: "Enterprise", users: 32, price: "$49.99" },
  ]);

  const stats = {
    totalUsers: 242,
    totalSubscribers: 118,
    todayRegistered: 8,
    todaySubscribed: 3,
    avgCreditScore: 685,
    totalRevenue: "$4,328.52",
  };

  const getTabTitle = (tab) => {
    const titles = {
      dashboard: "Dashboard",
      users: "Users Management",
      subscriptions: "Subscription List",
      notifications: "Notification Manage",
      approveAgents: "Agent Approve",
      walletApproval: "Wallet Approval",
      bankSettings: "Bank Settings",
    };
    return titles[tab] || "Dashboard";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent stats={stats} />;
      case "users":
        return <UsersContent users={users} setUsers={setUsers} />;
      case "subscriptions":
        return <SubscriptionsContent subscriptions={subscriptions} />;
      case "notifications":
        return <NotificationsContent />;
      case "approveAgents":
        return <AgentApprove />;
      case "walletApproval":
        return <WalletApprovalContent />;
      case "bankSettings":
        return <BankSettingsContent />;
      default:
        return <DashboardContent stats={stats} />;
    }
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("agentId");
      localStorage.removeItem("isApproved");

      // Redirect to the login page
      navigate("/Login");
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
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarLink
            icon={<UsersIcon size={20} />}
            title="Users Management"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <SidebarLink
            icon={<CreditCardIcon size={20} />}
            title="Subscription List"
            active={activeTab === "subscriptions"}
            onClick={() => setActiveTab("subscriptions")}
          />
          <SidebarLink
            icon={<BellIcon size={20} />}
            title="Notification Manage"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <SidebarLink
            icon={<ShieldCheckIcon size={20} />}
            title="Agent Approve"
            active={activeTab === "approveAgents"}
            onClick={() => setActiveTab("approveAgents")}
          />
          <SidebarLink
            icon={<WalletIcon size={20} />}
            title="Wallet Approval"
            active={activeTab === "walletApproval"}
            onClick={() => setActiveTab("walletApproval")}
          />
          <SidebarLink
            icon={<WalletIcon size={20} />}
            title="Bank Settings"
            active={activeTab === "bankSettings"}
            onClick={() => setActiveTab("bankSettings")}
          />

          <div className="mt-8 p-4 border-t border-gray-700">
            <SidebarLink
              icon={<LogOutIcon size={20} />}
              title="Logout"
              onClick={handleLogout} // Call handleLogout on click
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{getTabTitle(activeTab)}</h1>
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