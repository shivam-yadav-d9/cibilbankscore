import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function WalletPage() {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [spendAmount, setSpendAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [bankSettings, setBankSettings] = useState(null);
  
  const { user, isAuthenticated } = useAuth();
  const email = user?.email;

  // Calculate balance from transactions as a fallback
  const calculateBalanceFromTransactions = (transactions) => {
    return transactions
      .filter(txn => txn.status === 'approved') // Only include approved transactions
      .reduce((balance, txn) => {
        if (txn.type === 'credit') {
          return balance + parseFloat(txn.amount);
        } else if (txn.type === 'debit') {
          return balance - parseFloat(txn.amount);
        }
        return balance;
      }, 0);
  };

  // Fetch bank settings for QR code
  const fetchBankSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bank-settings`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBankSettings(data.bankDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching bank settings:', error);
    }
  };

  // Fetch wallet data on component mount
  useEffect(() => {
    if (email) {
      fetchWalletData();
    }
    fetchBankSettings(); // Fetch bank settings for QR code
  }, [email]);

  const fetchWalletData = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      
      // Fetch both balance and transactions
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/balance?email=${encodeURIComponent(email)}`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/transactions?email=${encodeURIComponent(email)}`)
      ]);

      let fetchedTransactions = [];
      let fetchedBalance = 0;

      // Handle transactions response first
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        if (transactionsData.success) {
          fetchedTransactions = transactionsData.transactions || [];
          setTransactions(fetchedTransactions);
        }
      } else {
        console.error('Failed to fetch transactions:', transactionsRes.status);
      }

      // Handle balance response
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        if (balanceData.success) {
          fetchedBalance = balanceData.balance || 0;
          setWalletBalance(fetchedBalance);
        }
      } else {
        console.error('Failed to fetch balance:', balanceRes.status);
        // If balance API fails, calculate from transactions
        if (fetchedTransactions.length > 0) {
          const calculatedBalance = calculateBalanceFromTransactions(fetchedTransactions);
          setWalletBalance(calculatedBalance);
          console.log('Using calculated balance from transactions:', calculatedBalance);
        }
      }

      // Double-check: if there's a significant discrepancy, use calculated balance
      if (fetchedTransactions.length > 0) {
        const calculatedBalance = calculateBalanceFromTransactions(fetchedTransactions);
        const discrepancy = Math.abs(fetchedBalance - calculatedBalance);
        
        if (discrepancy > 0.01) { // More than 1 paisa difference
          console.warn(`Balance discrepancy detected. API: ${fetchedBalance}, Calculated: ${calculatedBalance}`);
          setWalletBalance(calculatedBalance);
        }
      }
    } catch (err) {
      console.error("Failed to fetch wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add funds
  const handleAddFunds = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    if (!isAuthenticated || !email) {
      setSubmitMessage("Please log in to continue.");
      setLoading(false);
      return;
    }

    // Validate inputs
    if (!amount || !utr || !screenshot) {
      setSubmitMessage("Please fill all fields and upload a screenshot.");
      setLoading(false);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setSubmitMessage("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('amount', amount);
    formData.append('utr', utr);
    formData.append('screenshot', screenshot);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/add-funds`, {
        method: 'POST',
        body: formData,
      });

      let data;
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // If response is not JSON, it might be an HTML error page
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (res.ok && data.success) {
        // Success - refresh wallet data
        await fetchWalletData();
        
        // Clear form
        setAmount('');
        setUtr('');
        setScreenshot(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        setSubmitMessage(data.message || 'Payment submitted successfully! It will be verified and added to your wallet.');
      } else {
        setSubmitMessage(data?.message || "Failed to submit payment information.");
      }
    } catch (err) {
      console.error('Add funds error:', err);
      setSubmitMessage('Something went wrong while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Spend from wallet
  const handleSpendMoney = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    const spendAmountNum = parseFloat(spendAmount);
    
    if (isNaN(spendAmountNum) || spendAmountNum <= 0) {
      setSubmitMessage('Please enter a valid amount to spend.');
      setLoading(false);
      return;
    }
    
    if (spendAmountNum > walletBalance) {
      setSubmitMessage(`Insufficient wallet balance! Available: ₹${walletBalance.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          amount: spendAmountNum,
          description: 'Purchase/Service'
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('Server returned an invalid response');
      }

      if (res.ok && data.success) {
        // Success - refresh wallet data
        await fetchWalletData();
        setSpendAmount('');
        setSubmitMessage(data.message || 'Payment successful!');
      } else {
        setSubmitMessage(data?.message || "Failed to process payment.");
      }
    } catch (err) {
      console.error('Spend money error:', err);
      setSubmitMessage('Something went wrong while processing payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only image files (JPEG, PNG, GIF, WebP)');
        e.target.value = '';
        return;
      }
      
      setScreenshot(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Wallet</h1>
        <p className="text-red-600">Please log in to access your wallet.</p>
      </div>
    );
  }

  // Calculate approved transaction totals for display
  const approvedCredits = transactions
    .filter(txn => txn.type === 'credit' && txn.status === 'approved')
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  
  const approvedDebits = transactions
    .filter(txn => txn.type === 'debit' && txn.status === 'approved')
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      {/* Wallet Balance Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
        <p className="text-3xl font-bold">₹{walletBalance.toFixed(2)}</p>
        {/* Show balance breakdown */}
        <div className="text-sm mt-3 opacity-90">
          <p>Total Added (Approved): ₹{approvedCredits.toFixed(2)}</p>
          <p>Total Spent: ₹{approvedDebits.toFixed(2)}</p>
        </div>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitMessage.includes('successfully') || submitMessage.includes('successful') 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {submitMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Money Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-600">💰 Add Money</h3>
          
          {/* QR Code Display - Show QR image directly */}
          {bankSettings?.qrImagePath ? (
            <div className="mb-6 text-center">
              <p className="text-sm font-medium mb-3">📱 Scan QR Code to Pay</p>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${bankSettings.qrImagePath}`}
                alt="Payment QR Code"
                className="max-w-full h-auto mx-auto rounded-lg shadow-md border"
                style={{ maxHeight: '250px', maxWidth: '250px' }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Scan the QR code above to make payment
              </p>
            </div>
          ) : bankSettings ? (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded mb-4 text-center">
              <p className="text-sm">QR Code not available</p>
              <p className="text-xs">Please contact admin for payment details</p>
            </div>
          ) : (
            <div className="bg-gray-100 border border-gray-300 text-gray-600 p-3 rounded mb-4 text-center">
              <p className="text-sm animate-pulse">Loading payment options...</p>
            </div>
          )}

          <form onSubmit={handleAddFunds}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount (INR) *</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bank UTR Number *</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="Enter UTR number"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload Payment Screenshot *</label>
              <input
                type="file"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
                accept="image/*"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Formats: JPEG, PNG, GIF, WebP</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Payment Info'}
            </button>
          </form>
        </div>

        {/* Spend Money Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">🛒 Use Wallet Money</h3>
          
          <form onSubmit={handleSpendMoney}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount to Spend</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder="Enter amount to spend"
                min="0.01"
                max={walletBalance}
                step="0.01"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: ₹{walletBalance.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !spendAmount || parseFloat(spendAmount) > walletBalance || parseFloat(spendAmount) <= 0}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Pay with Wallet'}
            </button>
          </form>

          {/* Quick spend buttons */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Quick Amounts:</p>
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setSpendAmount(amt.toString())}
                  disabled={amt > walletBalance || loading}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">📊 Transaction History</h3>
        
        {loading && transactions.length === 0 ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn._id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">
                    {txn.type === 'credit' ? '💰 Money Added' : '🛒 Money Spent'}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      txn.status === 'approved' ? 'bg-green-100 text-green-800' :
                      txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {txn.utr && `UTR: ${txn.utr}`}
                    {txn.description && !txn.utr && txn.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(txn.created_at).toLocaleString()}
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{parseFloat(txn.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}