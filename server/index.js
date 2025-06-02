import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix for ES modules - Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/authroutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import message from "./routes/messages.js";
import savedocsRoutes from "./routes/saveDocsRoutes.js";
import notification from "./routes/notifications.js";
import loanRoutes from "./routes/loanRoutes.js";
import loanstatusRoutes from "./routes/loanStatusRoutes.js"
import UserAddress from "./routes/UserAddress.js";
import userSecondAddressRoutes from "./routes/userSecondAddress.js";
import LoanProcessorRoutes from "./routes/LoanProcessorRoutes.js";
import coApplicantRoutes from "./routes/coApplicantRoutes.js";
import userReferencesRoute from "./routes/userReferences.js";
import userPreviousLoanRoutes from "./routes/userPreviousLoanRoutes.js";
import AgentRoutes from "./routes/AgentRoute.js";
import creditCheckRoutes from "./routes/creditCheck.js";
import forgetpassword from "./routes/forgotPassword.js";
import forgotPasswordAgentRoutes from "./routes/forgotPasswordAgentroute.js";
import expertConnectRoutes from "./routes/expertConnect.js";
import adminRoutes from './routes/adminRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import loanStatusRoutes from './routes/loanStatusRoutes.js';
import documentRoutes from "./routes/documentRoutes.js"
import applicationRoutes from './routes/applicationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Allowed client origin
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
];

// ✅ Corrected CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "token"
  ],
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io initialization
const io = new Server(server, {
  cors: corsOptions
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("new_message", (message) => {
    socket.broadcast.emit("notification", {
      message: message.content,
      sender: message.sender,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Ensure uploads directory exists (using fixed __dirname)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory exists');
}

// Debug: List files in uploads directory
try {
  const files = fs.readdirSync(uploadsDir);
  console.log('📁 Files in uploads directory:', files.length > 0 ? files.slice(0, 5) + (files.length > 5 ? ` ... and ${files.length - 5} more` : '') : 'No files found');
} catch (error) {
  console.error('❌ Error reading uploads directory:', error.message);
}

// ✅ Enhanced static file serving with better error handling
app.use('/uploads', (req, res, next) => {
  const requestedFile = req.path;
  const fullPath = path.join(__dirname, 'uploads', requestedFile);
  
  console.log('🔍 Static file request:', requestedFile);
  console.log('📍 Full path:', fullPath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log('❌ File not found:', fullPath);
    
    // List available files for debugging
    try {
      const availableFiles = fs.readdirSync(path.join(__dirname, 'uploads')).slice(0, 10);
      return res.status(404).json({
        success: false,
        error: 'File not found',
        requestedPath: requestedFile,
        message: `File '${requestedFile}' not found in uploads directory`,
        availableFiles: availableFiles,
        totalFiles: fs.readdirSync(path.join(__dirname, 'uploads')).length
      });
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: 'File not found and could not read directory',
        requestedPath: requestedFile
      });
    }
  }
  
  console.log('✅ File found, serving:', requestedFile);
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  // Set proper headers for different file types
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
    };
    
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    // Add cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    console.log(`📤 Serving ${path.basename(filePath)} with Content-Type: ${mimeTypes[ext] || 'default'}`);
  },
  // Add error handling
  fallthrough: false
}));

// Add a test route to verify uploads work
app.get('/test-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    const fileDetails = files.map(file => {
      const filePath = path.join(__dirname, 'uploads', file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: `${(stats.size / 1024).toFixed(2)} KB`,
        modified: stats.mtime.toISOString(),
        url: `${req.protocol}://${req.get('host')}/uploads/${file}`
      };
    });

    res.json({
      success: true,
      message: 'Uploads directory accessible',
      uploadsPath: path.join(__dirname, 'uploads'),
      totalFiles: files.length,
      files: fileDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cannot access uploads directory',
      message: error.message
    });
  }
});

// Routes
app.use("/user", authRoutes);
app.use("/api", apiRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/messages", message);
app.use("/api/notifications", notification);
app.use("/api/loan", loanRoutes);
app.use("/api/loan", loanstatusRoutes);
app.use("/api/user-address", UserAddress);
app.use("/api/user-second-address", userSecondAddressRoutes);
app.use("/api/user-co-app", coApplicantRoutes);
app.use("/api/user-references", userReferencesRoute);
app.use("/api/user-previous-loans", userPreviousLoanRoutes);
app.use("/api/loan/docs", savedocsRoutes);
app.use("/api/SignupRoutes", AgentRoutes);
app.use("/agent", AgentRoutes);
app.use("/api/loanProcessor", LoanProcessorRoutes);
app.use("/api/credit", creditCheckRoutes);
app.use("/api/auth", forgetpassword);
app.use("/api/agent", forgotPasswordAgentRoutes);
app.use("/api/expert-connect", expertConnectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/loan', loanStatusRoutes);
app.use('/api', documentRoutes);
app.use('/api/applications', applicationRoutes); 

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Global error handler for static files
app.use((err, req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    console.error('❌ Static file error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error serving static file',
      message: err.message
    });
  }
  next(err);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads accessible at: http://localhost:${PORT}/uploads/`);
  console.log(`🔧 Test uploads at: http://localhost:${PORT}/test-uploads`);
});