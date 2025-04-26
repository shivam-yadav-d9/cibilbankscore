import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Send, CreditCard, History, Bell, Settings, Plus, ChevronRight, Banknote, Tag, Gift, Smartphone } from 'lucide-react';

const WalletPage = () => {
  const [balance, setBalance] = useState(5250.75);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 500, description: 'Added money from Bank', date: '24 Apr 2025', time: '10:45 AM', status: 'completed' },
    { id: 2, type: 'debit', amount: 249, description: 'Electricity Bill Payment', date: '22 Apr 2025', time: '09:15 AM', status: 'completed' },
    { id: 3, type: 'debit', amount: 150, description: 'Mobile Recharge', date: '20 Apr 2025', time: '06:30 PM', status: 'completed' },
    { id: 4, type: 'credit', amount: 1000, description: 'Cashback Received', date: '18 Apr 2025', time: '11:20 AM', status: 'completed' },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <WalletIcon className="mr-2" size={24} />
            <h1 className="text-xl font-bold">My Wallet</h1>
          </div>
          <div className="flex items-center">
            <Bell className="mr-4" size={20} />
            <Settings size={20} />
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="mx-4 -mt-2 relative z-10">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-gray-500">Total Balance</h2>
            <button className="bg-blue-600 text-white text-sm rounded-full px-3 py-1 flex items-center">
              <Plus size={16} className="mr-1" /> Add Money
            </button>
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">₹{balance.toFixed(2)}</h1>
          </div>
          <div className="flex justify-between">
            <button className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-1">
                <Send size={20} className="text-blue-600" />
              </div>
              <span className="text-xs">Send</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-1">
                <CreditCard size={20} className="text-blue-600" />
              </div>
              <span className="text-xs">Pay</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-1">
                <History size={20} className="text-blue-600" />
              </div>
              <span className="text-xs">History</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-1">
                <Smartphone size={20} className="text-blue-600" />
              </div>
              <span className="text-xs">Recharge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white mt-4 p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <QuickAction icon={<Banknote />} title="Bills" />
          <QuickAction icon={<Smartphone />} title="Mobile" />
          <QuickAction icon={<Tag />} title="Offers" />
          <QuickAction icon={<Gift />} title="Rewards" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white mt-4 p-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="text-blue-600 text-sm flex items-center">
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      {/* Commission Disclaimer */}
      <div className="bg-red-50 p-4">
        <p className="text-red-600 text-sm font-medium text-center">
          If loan is not approved then commission is not granted. Commission will be added in a wallet after 15 days of disbursement date.
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white shadow-md">
        <div className="flex justify-around p-4">
          <BottomNavItem icon={<WalletIcon />} title="Wallet" active />
          <BottomNavItem icon={<Send />} title="Transfer" />
          <BottomNavItem icon={<CreditCard />} title="Pay" />
          <BottomNavItem icon={<History />} title="History" />
          <BottomNavItem icon={<Settings />} title="More" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title }) => {
  return (
    <button className="flex flex-col items-center">
      <div className="bg-blue-50 p-3 rounded-full mb-2">
        <div className="text-blue-600">{icon}</div>
      </div>
      <span className="text-xs">{title}</span>
    </button>
  );
};

const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';
  
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCredit ? (
            <Plus size={16} className="text-green-600" />
          ) : (
            <CreditCard size={16} className="text-red-600" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{transaction.description}</h3>
          <p className="text-xs text-gray-500">{transaction.date} • {transaction.time}</p>
        </div>
      </div>
      <div className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'}₹{transaction.amount}
      </div>
    </div>
  );
};

const BottomNavItem = ({ icon, title, active = false }) => {
  return (
    <button className="flex flex-col items-center">
      <div className={active ? 'text-blue-600' : 'text-gray-500'}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
        {title}
      </span>
    </button>
  );
};

export default WalletPage;