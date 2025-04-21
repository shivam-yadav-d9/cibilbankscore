import User from "../models/usermodel.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

// Utility functions for validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/; // For Indian 10-digit mobile numbers
    return mobileRegex.test(mobile);
};

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check for empty fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate mobile
        if (!isValidMobile(mobile)) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or mobile number already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            userType: "customer"
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: newUser._id, userType: newUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                userType: newUser.userType
            }
        });

    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic checks
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};




