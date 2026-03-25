const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.testmail.app",
  port: 587,
  auth: {
    user: process.env.SMTP_USER || "sigj7.test@inbox.testmail.app",
    pass: process.env.SMTP_PASS || "1d736d8b-c0f1-4f71-903b-020ed5b198dc"
  },
  logger: true,
  debug: true
});

async function sendVerificationEmail(email, token) {
  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your account:</p>
      <a href="${link}" style="padding:10px 20px;background:blue;color:white;text-decoration:none;">Verify Email</a>
    `,
  });

  console.log(`✅ Verification email sent to ${email}`);
}

module.exports = sendVerificationEmail;