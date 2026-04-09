const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const admins = await User.find({ role: 'Admin' });
    const adminEmails = admins.map(admin => admin.email).join(',');

    const info = await transporter.sendMail({
      from: `"Visitor App" <${process.env.EMAIL_USER}>`,
      to: to,
      cc: adminEmails,
      subject: subject,
      html: html,
      attachments: attachments
    });

    console.log("Email successfully sent to:", to);
    return info;
  } catch (error) {
    console.log("Error sending email:", error.message);
  }
};

module.exports = { sendEmail };
