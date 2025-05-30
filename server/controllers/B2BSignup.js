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

        // Check if the email already exists
        const existingEmail = await B2BSignup.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check if the phone number already exists
        const existingPhone = await B2BSignup.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate custom user ID
        const customId = generateCustomId();

        // Create a new agent
        const newUser = new B2BSignup({
            userId: customId,
            companyName,
            businessType,
            fullName,
            email,
            phone,
            password: hashedPassword,
            userType: 'business'
        });

        // Save the new user to the database
        await newUser.save();

        // Return a success response
        return res.status(201).json({
            message: 'Signup successful',
            userId: newUser.userId,
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await B2BSignup.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

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
                name: user.fullName,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error("Agent Login Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all agents for admin
export const getAllAgents = async (req, res) => {
    try {
        const agents = await B2BSignup.find({ userType: 'business' });
        res.status(200).json(agents);
    } catch (error) {
        console.error("Fetch Agents Error:", error.message);
        res.status(500).json({ message: "Failed to fetch agents" });
    }
};


// Delete agent by ID
export const deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAgent = await B2BSignup.findByIdAndDelete(id);

        if (!deletedAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json({ message: "Agent deleted successfully" });
    } catch (error) {
        console.error("Delete Agent Error:", error.message);
        res.status(500).json({ message: "Failed to delete agent" });
    }
};


// Approve agent
// PUT /api/SignupRoutes/approve/:id
// controllers/b2bController.js
export const approveAgent = async (req, res) => {
    try {
        const agent = await B2BSignup.findByIdAndUpdate(req.params.id, {
            status: 'approved',
        }, { new: true });

        res.json({ message: "Agent approved", agent });
    } catch (err) {
        res.status(500).json({ error: "Error approving agent" });
    }
};

export const rejectAgent = async (req, res) => {
    try {
        const agent = await B2BSignup.findByIdAndUpdate(req.params.id, {
            status: 'rejected',
        }, { new: true });

        res.json({ message: "Agent rejected", agent });
    } catch (err) {
        res.status(500).json({ error: "Error rejecting agent" });
    }
};



// controllers/agentController.js

export const getAgentById = async (req, res) => {
  try {
    const agent = await B2BSignup.findById(req.params.id);
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
