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
import applicationRoutes from "./routes/applicationRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Allowed client origin
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://13.234.67.80"
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
    "token" // ✅ Add 'token' header to allow your custom request
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

// Routes
app.use("/user", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/applications", applicationRoutes);
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

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
