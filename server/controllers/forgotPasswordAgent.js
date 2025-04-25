import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import B2BSignup from '../models/B2BSignup.js';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate reset token
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Send email with reset link
const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${email}`); // Log success
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Error sending email'); // Re-throw for handling in the controller
  }
};

// Forgot Password Handler
export const forgotPasswordAgent = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await B2BSignup.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const resetToken = generateResetToken(user._id);

    // Send the reset email
    try {
      await sendResetEmail(email, resetToken);
      res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError); // Log more detailed error
      return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' }); // More specific message
    }


  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Failed to process request. Please try again later.' });
  }
};

// Reset Password Handler
export const resetPasswordAgent = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(400).json({ message: 'Invalid or expired token' });  // Token expired or invalid
    }
    const userId = decoded.userId;

    const user = await B2BSignup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Failed to reset password. Please try again later.' });
  }
};