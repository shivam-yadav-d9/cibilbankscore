import B2BSignup from '../models/B2BSignup.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

function generateCustomId() {
    const prefix = 'DPMP';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
}

export const signupB2BUser = async (req, res) => {
    try {
        const { companyName, businessType, fullName, email, phone, password } = req.body;

        const existingUser = await B2BSignup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const customId = generateCustomId();

        const newUser = new B2BSignup({
            userId: customId,
            companyName,
            businessType,
            fullName,
            email,
            phone,
            password: hashedPassword,
            userType: 'agent' // ADD THIS LINE
        });

        await newUser.save();

        return res.status(201).json({
            message: 'Signup successful',
            userId: newUser.userId,
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Login Function for Agent:
export const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email in B2BSignup collection
        const user = await B2BSignup.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Agent login successful",
            token,
            user: {
                _id: user._id,
                name: user.fullName, // Assuming 'fullName' is the name field
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error("Agent Login Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};