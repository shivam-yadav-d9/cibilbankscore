import B2BSignup from '../models/B2BSignup.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

// Utility function to generate custom ID
const generateCustomId = () => {
    const prefix = 'DPMP';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
};

// Utility function for consistent response format
const createResponse = (success, message, data = null, statusCode = 200) => {
    return {
        success,
        message,
        data,
        statusCode
    };
};

// B2B User Signup
export const signupB2BUser = async (req, res) => {
    try {
        const { companyName, businessType, fullName, email, phone, password } = req.body;

        // Input validation
        if (!companyName || !businessType || !fullName || !email || !phone || !password) {
            return res.status(200).json(
                createResponse(false, 'All fields are required', null, 400)
            );
        }

        // Check if email already exists
        const existingEmail = await B2BSignup.findOne({ email });
        if (existingEmail) {
            return res.status(200).json(
                createResponse(false, 'Email already registered', null, 409)
            );
        }

        // Check if phone already exists
        const existingPhone = await B2BSignup.findOne({ phone });
        if (existingPhone) {
            return res.status(200).json(
                createResponse(false, 'Phone number already registered', null, 409)
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        const customId = generateCustomId();

        // Create new user
        const newUser = new B2BSignup({
            userId: customId,
            companyName,
            businessType,
            fullName,
            email,
            phone,
            password: hashedPassword,
            userType: 'business',
            status: 'pending' // Default status
        });

        await newUser.save();

        // Success response
        return res.status(200).json(
            createResponse(true, 'Signup successful', {
                userId: newUser.userId,
                companyName: newUser.companyName,
                fullName: newUser.fullName,
                email: newUser.email,
                status: newUser.status
            }, 201)
        );

    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(200).json(
            createResponse(false, 'Internal server error', null, 500)
        );
    }
};

// Agent Login
export const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(200).json(
                createResponse(false, 'Email and password are required', null, 400)
            );
        }

        // Find user
        const user = await B2BSignup.findOne({ email });
        if (!user) {
            return res.status(200).json(
                createResponse(false, 'Invalid credentials', null, 401)
            );
        }

        // Check if user is approved
        if (user.status !== 'approved') {
            return res.status(200).json(
                createResponse(false, `Account is ${user.status}. Please wait for approval.`, null, 403)
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json(
                createResponse(false, 'Invalid credentials', null, 401)
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                userType: user.userType,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Success response
        return res.status(200).json(
            createResponse(true, 'Login successful', {
                token,
                user: {
                    _id: user._id,
                    userId: user.userId,
                    name: user.fullName,
                    email: user.email,
                    companyName: user.companyName,
                    userType: user.userType,
                    status: user.status
                }
            })
        );

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(200).json(
            createResponse(false, 'Internal server error', null, 500)
        );
    }
};

// Get all agents (Admin only)
export const getAllAgents = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = { userType: 'business' };
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;
        const agents = await B2BSignup.find(query)
            .select('-password') // Exclude password field
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await B2BSignup.countDocuments(query);

        return res.status(200).json(
            createResponse(true, 'Agents fetched successfully', {
                agents,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            })
        );

    } catch (error) {
        console.error("Fetch Agents Error:", error);
        return res.status(200).json(
            createResponse(false, 'Failed to fetch agents', null, 500)
        );
    }
};

// Get single agent by ID
export const getAgentById = async (req, res) => {
    try {
        const { id } = req.params;

        const agent = await B2BSignup.findById(id).select('-password');
        
        if (!agent) {
            return res.status(200).json(
                createResponse(false, 'Agent not found', null, 404)
            );
        }

        return res.status(200).json(
            createResponse(true, 'Agent fetched successfully', { agent })
        );

    } catch (error) {
        console.error("Get Agent Error:", error);
        return res.status(200).json(
            createResponse(false, 'Server error', null, 500)
        );
    }
};

// Approve agent
export const approveAgent = async (req, res) => {
    try {
        const { id } = req.params;

        const agent = await B2BSignup.findByIdAndUpdate(
            id,
            { 
                status: 'approved',
                approvedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!agent) {
            return res.status(200).json(
                createResponse(false, 'Agent not found', null, 404)
            );
        }

        return res.status(200).json(
            createResponse(true, 'Agent approved successfully', { agent })
        );

    } catch (error) {
        console.error("Approve Agent Error:", error);
        return res.status(200).json(
            createResponse(false, 'Error approving agent', null, 500)
        );
    }
};

// Reject agent
export const rejectAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const agent = await B2BSignup.findByIdAndUpdate(
            id,
            { 
                status: 'rejected',
                rejectedAt: new Date(),
                rejectionReason: reason || 'No reason provided'
            },
            { new: true }
        ).select('-password');

        if (!agent) {
            return res.status(200).json(
                createResponse(false, 'Agent not found', null, 404)
            );
        }

        return res.status(200).json(
            createResponse(true, 'Agent rejected successfully', { agent })
        );

    } catch (error) {
        console.error("Reject Agent Error:", error);
        return res.status(200).json(
            createResponse(false, 'Error rejecting agent', null, 500)
        );
    }
};

// Delete agent
export const deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAgent = await B2BSignup.findByIdAndDelete(id);

        if (!deletedAgent) {
            return res.status(200).json(
                createResponse(false, 'Agent not found', null, 404)
            );
        }

        return res.status(200).json(
            createResponse(true, 'Agent deleted successfully', { 
                deletedAgent: {
                    _id: deletedAgent._id,
                    userId: deletedAgent.userId,
                    companyName: deletedAgent.companyName,
                    fullName: deletedAgent.fullName
                }
            })
        );

    } catch (error) {
        console.error("Delete Agent Error:", error);
        return res.status(200).json(
            createResponse(false, 'Failed to delete agent', null, 500)
        );
    }
};

// Update agent profile
export const updateAgentProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, businessType, fullName, phone } = req.body;

        const agent = await B2BSignup.findByIdAndUpdate(
            id,
            { 
                companyName, 
                businessType, 
                fullName, 
                phone,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!agent) {
            return res.status(200).json(
                createResponse(false, 'Agent not found', null, 404)
            );
        }

        return res.status(200).json(
            createResponse(true, 'Profile updated successfully', { agent })
        );

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(200).json(
            createResponse(false, 'Failed to update profile', null, 500)
        );
    }
};

// Get agent statistics (Admin dashboard)
export const getAgentStats = async (req, res) => {
    try {
        const stats = await B2BSignup.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalAgents = await B2BSignup.countDocuments({ userType: 'business' });
        
        const formattedStats = {
            total: totalAgents,
            pending: 0,
            approved: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            if (stat._id) {
                formattedStats[stat._id] = stat.count;
            }
        });

        return res.status(200).json(
            createResponse(true, 'Statistics fetched successfully', { stats: formattedStats })
        );

    } catch (error) {
        console.error("Get Stats Error:", error);
        return res.status(200).json(
            createResponse(false, 'Failed to fetch statistics', null, 500)
        );
    }
};