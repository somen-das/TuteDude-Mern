const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments
    });

    return true;
  } catch (error) {
    console.error("Error details:", error.message);
    return false; 
  }
};

module.exports = { sendEmail };
