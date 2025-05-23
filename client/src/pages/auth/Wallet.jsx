import React, { useState, useEffect } from 'react';

export default function WalletPage() {
  const [amount, setAmount] = useState('');
  const [submittedAmount, setSubmittedAmount] = useState(null); // NEW: store submitted amount
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('utr', utr);
    formData.append('screenshot', screenshot);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/add-funds`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions([data, ...transactions]);
        setSubmittedAmount(amount); // ✅ Save last submitted amount
        setAmount('');
        setUtr('');
        setScreenshot(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>

      <button
        onClick={() => window.open('/bankQR.jpg', '_blank')}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Scan QR to Pay
      </button>

      {/* ✅ Show submitted amount or current amount */}
      {(submittedAmount || amount) && (
        <div className="mb-4">
          <button
            type="button"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add ₹{amount || submittedAmount}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount (INR)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Bank UTR Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Upload Screenshot</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setScreenshot(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Payment Info
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Your Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((txn, idx) => (
          <li key={idx} className="p-2 border rounded bg-gray-50">
            Amount: ₹{txn.amount} | UTR: {txn.utr}
          </li>
        ))}
      </ul>
    </div>
  );
}
