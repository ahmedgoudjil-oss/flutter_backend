const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
  logger: true, // لتتبع الأخطاء
  debug: true,
});

async function sendVerificationEmail(email, token) {
  // استخدم رابط التطبيق على Render وليس localhost
  const link = `https://flutter-backend-1-xv48.onrender.com/api/auth/verify-email?token=${token}`;

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