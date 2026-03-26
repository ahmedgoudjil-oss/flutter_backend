const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  locality: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;