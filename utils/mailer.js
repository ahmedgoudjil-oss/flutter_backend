const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

async function sendVerificationEmail(email, token) {
  const link = `http://localhost:${process.env.PORT}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your account:</p>
      <a href="${link}" style="padding:10px 20px;background:blue;color:white;text-decoration:none;">Verify Email</a>
    `,
  });
}

module.exports = sendVerificationEmail;