const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectDB = require("../lib/db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register
router.post("/register", async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Login
router.post("/login", async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
