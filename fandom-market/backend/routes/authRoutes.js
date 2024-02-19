const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});


const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    // Generate a token
    const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '24h' });
    res.status(200).json({ token, userId: user._id, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});


module.exports = router;
