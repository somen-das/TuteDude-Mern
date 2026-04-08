const nodemailer = require('nodemailer');
const User = require('../models/User');

let transporter = null;

const createTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        const mailTransporter = createTransporter();
        
        
        const admins = await User.find({ role: 'Admin' });
        const adminEmails = admins.map(a => a.email).join(',');

        const info = await mailTransporter.sendMail({
            from: `"PassManager System" <${process.env.EMAIL_USER}>`,
            to,
            cc: adminEmails,
            subject,
            html,
            attachments
        });

        console.log(`[Email Sent to ${to}] Subject: "${subject}" | MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Failed to send email: ", error);
    }
};

module.exports = { sendEmail };
