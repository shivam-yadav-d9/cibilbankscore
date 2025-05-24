import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  ClockIcon,
  DollarSignIcon,
  UserIcon,
  CalendarIcon,
  ImageIcon,
  RefreshCwIcon
} from 'lucide-react';

const WalletApprovalContent = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Fetch pending transactions for approval
      const pendingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/pending-transactions`);
      
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        if (pendingData.success) {
          setPendingTransactions(pendingData.transactions || []);
        }
      }

      // Fetch all transactions for history tab
      const allRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/all-transactions`);
      
      if (allRes.ok) {
        const allData = await allRes.json();
        if (allData.success) {
          setAllTransactions(allData.transactions || []);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/approve/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Transaction approved successfully!');
        await fetchTransactions(); // Refresh the list
      } else {
        setMessage(data.message || 'Failed to approve transaction');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
      setMessage('Failed to approve transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (transactionId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/reject/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Transaction rejected successfully!');
        setShowModal(false);
        setRejectReason('');
        await fetchTransactions(); // Refresh the list
      } else {
        setMessage(data.message || 'Failed to reject transaction');
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      setMessage('Failed to reject transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setRejectReason('');
  };

  const viewScreenshot = (filename) => {
    // Open screenshot in new tab
    window.open(`${import.meta.env.VITE_BACKEND_URL}/uploads/${filename}`, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TransactionCard = ({ transaction, showActions = true }) => (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <UserIcon size={16} className="text-gray-500" />
          <span className="font-medium text-gray-900">{transaction.email}</span>
        </div>
        {getStatusBadge(transaction.status)}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-center space-x-2">
          <DollarSignIcon size={16} className="text-green-500" />
          <span className="font-bold text-lg text-green-600">₹{transaction.amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">{formatDate(transaction.created_at)}</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <strong>UTR:</strong> {transaction.utr}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => viewScreenshot(transaction.screenshot)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ImageIcon size={16} />
          <span>View Screenshot</span>
        </button>

        {showActions && transaction.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(transaction._id)}
              disabled={actionLoading}
              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircleIcon size={14} />
              <span>Approve</span>
            </button>
            <button
              onClick={() => openRejectModal(transaction)}
              disabled={actionLoading}
              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              <XCircleIcon size={14} />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Wallet Transactions</h2>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCwIcon size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {message}
          <button 
            onClick={() => setMessage('')}
            className="float-right text-lg font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Approvals ({pendingTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Transactions ({allTransactions.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCwIcon size={24} className="animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading transactions...</span>
          </div>
        ) : activeTab === 'pending' ? (
          <div>
            {pendingTransactions.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Transactions</h3>
                <p className="text-gray-500">All transactions have been processed.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {allTransactions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSignIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                <p className="text-gray-500">No wallet transactions found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {allTransactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction._id} 
                    transaction={transaction} 
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Transaction</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject this transaction from <strong>{selectedTransaction?.email}</strong> 
              for ₹{selectedTransaction?.amount?.toFixed(2)}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional):
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter reason for rejection..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTransaction._id)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletApprovalContent;