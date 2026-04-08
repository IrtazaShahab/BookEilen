const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const db = require("../db");

// Temporary in-memory store (in production, use Redis)
const resetCodes = new Map();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Reset Code
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with 10-minute expiry
    resetCodes.set(email, { code, expiry: Date.now() + 10 * 60 * 1000 });

    await transporter.sendMail({
      from: `"BookEilen Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "BookEilen - Password Reset Code",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your verification code is:</p>
        <h1 style="color:#4F46E5">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.json({ success: true, message: "Verification code sent successfully!" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Frontend currently calls /users/reset-password for requesting code too.
// Support both flows in this route:
// 1) { email } -> send code
// 2) { email, code, newPassword } -> reset password
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Step 1: send code
    if (!code && !newPassword) {
      const result = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes.set(email, { code: generatedCode, expiry: Date.now() + 10 * 60 * 1000 });

      await transporter.sendMail({
        from: `"BookEilen Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BookEilen - Password Reset Code",
        html: `
          <h2>Password Reset Request</h2>
          <p>Your verification code is:</p>
          <h1 style="color:#4F46E5">${generatedCode}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        `,
      });

      return res.json({ success: true, message: "Verification code sent successfully!" });
    }

    // Step 2: verify code and reset password
    if (!code || !newPassword) {
      return res.status(400).json({ message: "Code and newPassword are required" });
    }

    const stored = resetCodes.get(email);
    if (!stored) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (stored.code !== code) {
      return res.status(400).json({ message: "Incorrect code" });
    }

    if (Date.now() > stored.expiry) {
      resetCodes.delete(email);
      return res.status(400).json({ message: "Code expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);
    resetCodes.delete(email);

    return res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("Error in reset-password flow:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Verify & Reset Password
router.post("/reset-password-legacy", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const stored = resetCodes.get(email);
    if (!stored) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (stored.code !== code) {
      return res.status(400).json({ message: "Incorrect code" });
    }

    if (Date.now() > stored.expiry) {
      resetCodes.delete(email);
      return res.status(400).json({ message: "Code expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    resetCodes.delete(email);

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
