const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/mailer');

const authorRouter = express.Router();

// ================= Signup =================
authorRouter.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email Already exists" });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء Token للتحقق
    const token = crypto.randomBytes(32).toString('hex');

    let user = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken: token,
      tokenExpires: Date.now() + 3600000, // 1 ساعة
    });

    user = await user.save();

    // إرسال رابط التحقق
    await sendVerificationEmail(email, token);

    res.json({ msg: "Signup successful! Check your email to verify your account." });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= Verify Email =================
authorRouter.get('/api/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.send("❌ Token invalid or expired");

    user.isVerified = true;
    user.verificationToken = null;
    user.tokenExpires = null;

    await user.save();

    res.send("✅ Email verified successfully");

  } catch (e) {
    res.status(500).send("Server error");
  }
});

// ================= Signin =================
authorRouter.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(400).json({ msg: "User not found with this email" });
    if (!findUser.isVerified) return res.status(401).json({ msg: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: findUser._id },
      process.env.JWT_SECRET || "passwordKey",
      { expiresIn: "10d" }
    );

    const { password: pwd, ...userWithoutPassword } = findUser._doc;

    res.json({ token, user: userWithoutPassword });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= Update user info =================
authorRouter.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state, city, locality } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state, city, locality },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= Get all users =================
authorRouter.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // استبعاد كلمة المرور
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authorRouter;