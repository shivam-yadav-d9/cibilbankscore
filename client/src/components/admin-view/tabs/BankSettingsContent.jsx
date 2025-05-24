import React, { useState, useEffect } from 'react';
import { Save, Upload, Eye, EyeOff } from 'lucide-react';

const BankSettingsContent = () => {
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    qrImage: null
  });
  const [qrImagePreview, setQrImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAccountNo, setShowAccountNo] = useState(false);

  // Fetch existing bank details on component mount
  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bank-settings`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBankDetails({
            accountHolderName: data.bankDetails.accountHolderName || '',
            bankName: data.bankDetails.bankName || '',
            accountNo: data.bankDetails.accountNo || '',
            ifscCode: data.bankDetails.ifscCode || '',
            qrImage: null // We don't store the file object, just the path
          });
          
          // Set QR image preview if exists
          if (data.bankDetails.qrImagePath) {
            setQrImagePreview(`${import.meta.env.VITE_BACKEND_URL}${data.bankDetails.qrImagePath}`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setMessage('Failed to load bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQrImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('QR image size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please upload only image files (JPEG, PNG, GIF, WebP)');
        e.target.value = '';
        return;
      }
      
      setBankDetails(prev => ({
        ...prev,
        qrImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate required fields
    if (!bankDetails.accountHolderName || !bankDetails.bankName || 
        !bankDetails.accountNo || !bankDetails.ifscCode) {
      setMessage('Please fill all required fields');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('accountHolderName', bankDetails.accountHolderName);
    formData.append('bankName', bankDetails.bankName);
    formData.append('accountNo', bankDetails.accountNo);
    formData.append('ifscCode', bankDetails.ifscCode);
    
    if (bankDetails.qrImage) {
      formData.append('qrImage', bankDetails.qrImage);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bank-settings`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Bank details updated successfully!');
        // Refresh the data
        await fetchBankDetails();
      } else {
        setMessage(data.message || 'Failed to update bank details');
      }
    } catch (error) {
      console.error('Error updating bank details:', error);
      setMessage('Something went wrong while updating bank details');
    } finally {
      setLoading(false);
    }
  };

  const maskAccountNumber = (accountNo) => {
    if (!accountNo) return '';
    if (accountNo.length <= 4) return accountNo;
    return '****' + accountNo.slice(-4);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Bank Settings Management</h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        <div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Bank Account Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={bankDetails.accountHolderName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account holder name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bank name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <div className="relative">
                  <input
                    type={showAccountNo ? "text" : "password"}
                    name="accountNo"
                    value={bankDetails.accountNo}
                    onChange={handleInputChange}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account number"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountNo(!showAccountNo)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showAccountNo ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={bankDetails.ifscCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter IFSC code"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment QR Code</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload QR Code Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={handleQrImageChange}
                    accept="image/*"
                    className="hidden"
                    id="qr-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="qr-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload QR code image
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Max size: 5MB. Formats: JPEG, PNG, GIF, WebP
                    </span>
                  </label>
                </div>
              </div>

              {/* QR Code Preview */}
              {qrImagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Preview
                  </label>
                  <div className="border rounded-lg p-4 bg-gray-50 text-center">
                    <img
                      src={qrImagePreview}
                      alt="QR Code Preview"
                      className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{loading ? 'Saving...' : 'Save Bank Settings'}</span>
            </button>
          </div>
        </div>

        {/* Current Settings Preview */}
        {(bankDetails.accountHolderName || bankDetails.bankName) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Bank Details Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Account Holder:</strong> {bankDetails.accountHolderName}
                </div>
                <div>
                  <strong>Bank:</strong> {bankDetails.bankName}
                </div>
                <div>
                  <strong>Account No:</strong> {showAccountNo ? bankDetails.accountNo : maskAccountNumber(bankDetails.accountNo)}
                </div>
                <div>
                  <strong>IFSC:</strong> {bankDetails.ifscCode}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankSettingsContent;