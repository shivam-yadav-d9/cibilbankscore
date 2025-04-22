import User from "../models/usermodel.js"; // Import your user model
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import PasswordResetToken from "../models/passwordResetToken.js";  // Import the Password Reset Token model
import bcrypt from "bcryptjs";

dotenv.config();

// Create a transport for sending email (using nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Forgot password handler
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ email: user.email });

    // Create new password reset token in DB
    const token = new PasswordResetToken({
      email: user.email,
      token: hashedResetToken,
      expiresAt: Date.now() + 3600000,  // 1 hour expiration
    });
    await token.save();

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`; // Corrected link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click here to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset password handler
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token from the request
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Validate the token
    const resetToken = await PasswordResetToken.findOne({ token: hashedToken });

    if (!resetToken || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Find the user
    const user = await User.findOne({ email: resetToken.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the token after it has been used
    await PasswordResetToken.deleteOne({ token: hashedToken });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};