import User from "../models/usermodel.js";
dotenv.config();

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT Token after signup
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,  // Return token so user stays logged in
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
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

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); // Generic message
        }

        // Compare passwords
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" }); // Generic message
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
