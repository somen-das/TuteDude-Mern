// /utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        // ১. Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // ২. Email Template: ইমেইলটা দেখতে কেমন হবে
        const mailOptions = {
            from: `"User Dashboard Team" <${process.env.EMAIL_USER}>`, 
            to: userEmail,  //this is my user email
            subject: 'Welcome to User Dashboard!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #007BFF;">Hello ${userName},</h2>
                    <p>Welcome to our platform! We are thrilled to have you here.</p>
                    <p>Your registration was successful. You can now explore your dashboard.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><b>Team User Dashboard</b></p>
                </div>
            `
        };

        //  Send Mail
        const info = await transporter.sendMail(mailOptions);
        console.log(" Email sent successfully: ", info.response);
        return true;

    } catch (error) {
        console.error(" Email sending failed:", error);
        return false;
    }
};

module.exports = sendWelcomeEmail;