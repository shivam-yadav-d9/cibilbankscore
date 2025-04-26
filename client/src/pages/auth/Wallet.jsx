import React, { useState, useEffect } from 'react';
import { 
  Wallet, Send, CreditCard, History, Bell, Settings, Plus, 
  ChevronRight, Banknote, Tag, Gift, Smartphone, ArrowDown, 
  ArrowUp, Menu, Search, Wallet as WalletIcon
} from 'lucide-react';

const WalletPage = () => {
  const [balance, setBalance] = useState(5250.75);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 500, description: 'Added money from Bank', date: '24 Apr 2025', time: '10:45 AM', status: 'completed' },
    { id: 2, type: 'debit', amount: 249, description: 'Electricity Bill Payment', date: '22 Apr 2025', time: '09:15 AM', status: 'completed' },
    { id: 3, type: 'debit', amount: 150, description: 'Mobile Recharge', date: '20 Apr 2025', time: '06:30 PM', status: 'completed' },
    { id: 4, type: 'credit', amount: 1000, description: 'Cashback Received', date: '18 Apr 2025', time: '11:20 AM', status: 'completed' },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 rounded-b-xl shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Menu className="mr-3" size={22} />
            <h1 className="text-xl font-bold tracking-tight">My Wallet</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Search size={20} />
            <Bell size={20} />
            <div className="h-8 w-8 bg-indigo-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="mx-4 -mt-4 relative z-10">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-500 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-indigo-100 font-medium">Total Balance</h2>
            <div className="flex items-center text-xs bg-white/20 rounded-full px-3 py-1.5">
              <WalletIcon size={14} className="mr-1" />
              <span>Main Wallet</span>
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold">₹{balance.toFixed(2)}</h1>
            <p className="text-indigo-100 text-xs mt-1">Updated just now</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <ActionButton icon={<Plus />} label="Add" />
            <ActionButton icon={<Send />} label="Send" />
            <ActionButton icon={<CreditCard />} label="Pay" />
            <ActionButton icon={<History />} label="History" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white mt-6 mx-4 rounded-xl shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Services</h2>
        <div className="grid grid-cols-4 gap-4">
          <QuickAction icon={<Banknote />} title="Bills" />
          <QuickAction icon={<Smartphone />} title="Mobile" />
          <QuickAction icon={<Tag />} title="Offers" />
          <QuickAction icon={<Gift />} title="Rewards" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white mt-6 mx-4 rounded-xl shadow-sm p-5 flex-grow mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
          <button className="text-indigo-600 text-sm flex items-center font-medium">
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
      <div className="bg-amber-50 mx-4 mb-6 rounded-lg p-4 border border-amber-200">
        <p className="text-amber-700 text-sm font-medium text-center">
          If loan is not approved then commission is not granted. Commission will be added in a wallet after 15 days of disbursement date.
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100">
        <div className="flex justify-around p-3 max-w-md mx-auto">
          <BottomNavItem icon={<WalletIcon />} title="Wallet" active />
          <BottomNavItem icon={<Send />} title="Transfer" />
          <BottomNavItem icon={<Plus size={20} />} isMain />
          <BottomNavItem icon={<History />} title="History" />
          <BottomNavItem icon={<Settings />} title="More" />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }) => {
  return (
    <button className="flex flex-col items-center bg-white/10 rounded-lg py-2 hover:bg-white/20 transition-colors">
      <div className="mb-1">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

const QuickAction = ({ icon, title }) => {
  return (
    <button className="flex flex-col items-center">
      <div className="bg-indigo-50 p-3 rounded-xl mb-2">
        <div className="text-indigo-600">{icon}</div>
      </div>
      <span className="text-xs font-medium text-gray-700">{title}</span>
    </button>
  );
};

const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${isCredit ? 'bg-emerald-100' : 'bg-rose-100'}`}>
          {isCredit ? (
            <ArrowDown size={16} className="text-emerald-600" />
          ) : (
            <ArrowUp size={16} className="text-rose-600" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{transaction.description}</h3>
          <p className="text-xs text-gray-500">{transaction.date} • {transaction.time}</p>
        </div>
      </div>
      <div className={`font-semibold ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isCredit ? '+' : '-'}₹{transaction.amount}
      </div>
    </div>
  );
};

const BottomNavItem = ({ icon, title, active = false, isMain = false }) => {
  if (isMain) {
    return (
      <button className="flex items-center justify-center">
        <div className="bg-indigo-600 rounded-full p-3 text-white -mt-6 shadow-lg">
          {icon}
        </div>
      </button>
    );
  }
  
  return (
    <button className="flex flex-col items-center">
      <div className={active ? 'text-indigo-600' : 'text-gray-500'}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
        {title}
      </span>
    </button>
  );
};

export default WalletPage;