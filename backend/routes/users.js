const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

// Example routes
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

// Export both
module.exports = { router, User };
