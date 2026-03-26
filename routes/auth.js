const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const admin = require('../utils/firebaseAdmin');

const authRouter = express.Router();

// ================= Signin / Signup via Firebase =================
authRouter.post('/api/signin', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ msg: "idToken is required" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.email_verified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    let user = await User.findOne({ firebaseUID: decodedToken.uid });

    // إنشاء المستخدم إذا أول تسجيل دخول
    if (!user) {
      user = new User({
        fullName: decodedToken.name || "User",
        email: decodedToken.email,
        firebaseUID: decodedToken.uid
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.json({ token, user });
  } catch (e) {
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
});

// ================= Update User Info =================
authRouter.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state = "", city = "", locality = "" } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state: state.trim(), city: city.trim(), locality: locality.trim() },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    return res.json(updatedUser);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ================= Get All Users =================
authRouter.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;