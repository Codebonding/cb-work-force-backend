const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS  // Your email password or app-specific password
    }
});

const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };