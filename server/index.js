import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import message from "./routes/messages.js";
import savedocsRoutes from "./routes/saveDocsRoutes.js"
import notification from "./routes/notifications.js";
import { Server } from "socket.io";
import http from "http";

// loan journey here
import loanRoutes from "./routes/loanRoutes.js";
import UserAddress from "./routes/UserAddress.js";
import userSecondAddressRoutes from "./routes/userSecondAddress.js";

import LoanProcessorRoutes from './routes/LoanProcessorRoutes.js'; // Import loan processor routes


import coApplicantRoutes from "./routes/coApplicantRoutes.js";
import userReferencesRoute from "./routes/userReferences.js";
import userPreviousLoanRoutes from "./routes/userPreviousLoanRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js"
import SignupRoutes from './routes/AgentRoute.js';
import AgentRoutes from "./routes/AgentRoute.js"; // Import agent routes


import forgetpassword from "./routes/forgotPassword.js";  // Import the auth routes

import expertConnectRoutes from './routes/expertConnect.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with correct CORS settings
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // ✅ Allow frontend
        methods: ["GET", "POST"],
        credentials: true, // ✅ Allow credentials
    },
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
app.use(
    cors({
        origin: "http://localhost:5173", // ✅ Ensure this matches frontend origin
        methods: ["GET", "POST"],
        credentials: true, // ✅ Allow credentials
    })
);
app.use(express.json());

// Database Connection
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/Bankdata")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/user", authRoutes);
app.use("/api", apiRoutes);
app.use("/profile", profileRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/messages", message);
app.use("/api/notifications", notification);
app.use('/api/complaints', complaintRoutes);
app.use("/api/loan", loanRoutes); // **CHANGED TO /api/loan**
app.use("/api/user-address", UserAddress); // ✅ New route to save applicant data
app.use("/api/user-second-address", userSecondAddressRoutes);
app.use("/api/user-co-app", coApplicantRoutes);
app.use("/api/user-references", userReferencesRoute);
app.use("/api/user-previous-loans", userPreviousLoanRoutes);
app.use("/api/loan/docs", savedocsRoutes);
app.use('/api/SignupRoutes', SignupRoutes);
app.use("/agent", AgentRoutes); // Mount agent routes
app.use('/api/loanProcessor', LoanProcessorRoutes); // Mount loan processor routes


// Add the forgot password and reset password routes
app.use("/api/auth", forgetpassword);
app.use('/api/expert-connect', expertConnectRoutes);



console.log("TEST_VARIABLE:", process.env.TEST_VARIABLE);

// Basic route
app.get("/", (req, res) => {
    res.send("Notification API is running");
});

// Start Server
server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);