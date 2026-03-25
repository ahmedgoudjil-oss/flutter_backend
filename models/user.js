const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // لتجنب تكرار الإيميلات
    validate: {
      validator: (value) => {
        const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(value);
      },
      message: "Enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => value.length >= 8,
      message: "Password must be at least 8 characters",
    },
  },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  locality: { type: String, default: "" },

  // ================= Add Verification Fields =================
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  tokenExpires: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;