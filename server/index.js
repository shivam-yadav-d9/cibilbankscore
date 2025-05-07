import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/authroutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import message from "./routes/messages.js";
import savedocsRoutes from "./routes/saveDocsRoutes.js";
import notification from "./routes/notifications.js";
import loanRoutes from "./routes/loanRoutes.js";
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

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://13.234.67.70",
  "*"
  // Add additional origins as needed for different environments
];

// Comprehensive CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl requests)
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   maxAge: 86400 // 24 hours
// };

// Apply CORS middleware
// app.use(cors(corsOptions));

// Initialize Socket.io with matching CORS settings
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("new_message", (message) => {
    // Broadcast to all clients except sender
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect('mongodb+srv://cibiluser7:cibiluser%407@cibilbankscorecluster.arvti.mongodb.net/cibilDB?retryWrites=true&w=majority&appName=CibilBankScoreCluster') // Replace with your MongoDB URI
  .then(() => console.log("MongoDB Connected successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/user", authRoutes);
app.use("/api", apiRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/messages", message);
app.use("/api/notifications", notification);
app.use("/api/loan", loanRoutes);
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

// Basic route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start Server
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);