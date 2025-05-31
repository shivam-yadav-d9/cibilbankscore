// routes/walletRoutes.js - Fixed Version
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  addFunds, 
  getWalletBalance, 
  getUserTransactions, 
  spendMoney, 
  approveTransaction, 
  getPendingTransactions,
  getAllTransactions,
  rejectTransaction 
} from '../controllers/walletController.js';

const router = express.Router();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory at:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use absolute path
  },
  filename: (req, file, cb) => {
    // Create unique filename with proper extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // Increased to 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    console.log('📎 Uploading file:', file.originalname, 'MIME:', file.mimetype);
    
    // More comprehensive file type checking
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp'
    ];
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.includes(file.mimetype.toLowerCase());
    
    if (mimetype && extname) {
      console.log('✅ File accepted:', file.originalname);
      return cb(null, true);
    } else {
      console.log('❌ File rejected:', file.originalname, 'Extension:', path.extname(file.originalname), 'MIME:', file.mimetype);
      cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`));
    }
  }
});

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Routes
router.post('/add-funds', upload.single('screenshot'), handleMulterError, addFunds);
router.get('/balance', getWalletBalance);
router.get('/transactions', getUserTransactions);
router.post('/spend', spendMoney);

// Admin routes
router.get('/pending-transactions', getPendingTransactions);
router.get('/all-transactions', getAllTransactions);
router.put('/approve/:transactionId', approveTransaction);
router.put('/reject/:transactionId', rejectTransaction);

// Route to serve uploaded files with better error handling
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  console.log('📁 Requested file:', filename);
  console.log('📂 Full path:', filePath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('❌ File not found:', filePath);
    return res.status(404).json({ 
      success: false, 
      message: 'File not found',
      requestedFile: filename 
    });
  }
  
  // Get file stats
  const stats = fs.statSync(filePath);
  console.log('📊 File stats:', { size: stats.size, modified: stats.mtime });
  
  // Set appropriate headers
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp'
  };
  
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  
  // Send file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error sending file:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          message: 'Error serving file' 
        });
      }
    } else {
      console.log('✅ File served successfully:', filename);
    }
  });
});

// Debug route to list all files in uploads directory
router.get('/debug/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime,
        isFile: stats.isFile()
      };
    });
    
    res.json({
      success: true,
      uploadsDirectory: uploadsDir,
      totalFiles: files.length,
      files: fileDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading uploads directory',
      error: error.message
    });
  }
});

export default router;