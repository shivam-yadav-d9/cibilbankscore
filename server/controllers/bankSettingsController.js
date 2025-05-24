// controllers/bankSettingsController.js
import BankSettings from '../models/BankSettings.js';
import path from 'path';
import fs from 'fs';

// Get bank settings
export const getBankSettings = async (req, res) => {
  try {
    let bankSettings = await BankSettings.findOne();
    
    if (!bankSettings) {
      // Return empty settings if none exist yet
      return res.json({
        success: true,
        bankDetails: {
          accountHolderName: '',
          bankName: '',
          accountNo: '',
          ifscCode: '',
          qrImagePath: null
        }
      });
    }

    res.json({
      success: true,
      bankDetails: {
        accountHolderName: bankSettings.accountHolderName,
        bankName: bankSettings.bankName,
        accountNo: bankSettings.accountNo,
        ifscCode: bankSettings.ifscCode,
        qrImagePath: bankSettings.qrImagePath
      }
    });
  } catch (err) {
    console.error('Get bank settings error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank settings',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Update bank settings
export const updateBankSettings = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { accountHolderName, bankName, accountNo, ifscCode } = req.body;

    // Validate required fields
    if (!accountHolderName || !bankName || !accountNo || !ifscCode) {
      return res.status(400).json({
        success: false,
        message: 'All bank details are required'
      });
    }

    // Find existing settings or create new
    let bankSettings = await BankSettings.findOne();
    
    const updateData = {
      accountHolderName,
      bankName,
      accountNo,
      ifscCode,
      updated_at: new Date()
    };

    // Handle QR image upload if provided
    if (req.file) {
      // Delete old QR image if it exists
      if (bankSettings?.qrImagePath) {
        const oldImagePath = path.join(process.cwd(), 'uploads', path.basename(bankSettings.qrImagePath));
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Old QR image deleted:', oldImagePath);
          } catch (err) {
            console.error('Error deleting old QR image:', err);
          }
        }
      }
      
      updateData.qrImagePath = `/uploads/${req.file.filename}`;
    }

    if (bankSettings) {
      // Update existing settings
      Object.assign(bankSettings, updateData);
      await bankSettings.save();
    } else {
      // Create new settings
      updateData.created_at = new Date();
      bankSettings = await BankSettings.create(updateData);
    }

    res.json({
      success: true,
      message: 'Bank settings updated successfully!',
      bankDetails: {
        accountHolderName: bankSettings.accountHolderName,
        bankName: bankSettings.bankName,
        accountNo: bankSettings.accountNo,
        ifscCode: bankSettings.ifscCode,
        qrImagePath: bankSettings.qrImagePath
      }
    });
  } catch (err) {
    console.error('Update bank settings error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update bank settings',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};