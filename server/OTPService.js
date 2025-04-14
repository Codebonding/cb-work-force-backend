const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTPStorage = new Map(); // Store OTPs temporarily (Use Redis for production)

// SMTP Transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS  // Your email password
    }
});

// Generate OTP
const generateOTP = (length = 6) => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via Email
const sendOTP = async (email, otp, userName = 'User') => {
    try {
        const mailOptions = {
            from: `"KYC Verification Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your One-Time Password (OTP) for KYC Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                        <h1 style="margin: 0;">CodeBonding Workforce KYC Verification</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear ${userName},</p>
                        <p>Thank you for initiating the KYC (Know Your Customer) verification process with CodeBonding Workforce Company.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                            <h2 style="margin: 0; color: #2563eb;">Your Verification Code</h2>
                            <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; display: inline-block;">
                                ${otp}
                            </div>
                            <p style="margin: 5px 0; color: #dc2626;">This code will expire in 5 minutes</p>
                        </div>
                        
                        <p>For security reasons:</p>
                        <ul>
                            <li>Do not share this OTP with anyone</li>
                            <li>CodeBonding representatives will never ask for this code</li>
                            <li>If you didn't request this code, please contact our support team immediately</li>
                        </ul>
                        
                        <p>Need help? Contact our support team at <a href="mailto:cbwforce@gmail.com">cbwforce@gmail.com</a></p>
                        
                        <p>Best regards,<br>
                        The CodeBonding Workforce Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
                        <p>© ${new Date().getFullYear()} CodeBonding Workforce Company. All rights reserved.</p>
                        <p>123 Business Street, Tech City, TC 10001</p>
                    </div>
                </div>
            `,
            text: `
                CodeBonding Workforce KYC Verification

                Dear ${userName},

                Thank you for initiating the KYC verification process with CodeBonding Workforce Company.

                Your verification code is: ${otp}
                This code will expire in 5 minutes.

                For security reasons:
                - Do not share this OTP with anyone
                - CodeBonding representatives will never ask for this code
                - If you didn't request this code, please contact our support team immediately

                Need help? Contact our support team at support@codebonding.com

                Best regards,
                The CodeBonding Workforce Team

                © ${new Date().getFullYear()} CodeBonding Workforce Company. All rights reserved.
                123 Business Street, Tech City, TC 10001
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Store OTP Temporarily
const storeOTP = (userId, otp) => {
    OTPStorage.set(userId, { otp, expires: Date.now() + 5 * 60 * 1000 });
};

// Verify OTP
const verifyOTP = (userId, enteredOTP) => {
    const storedOTP = OTPStorage.get(userId);
    if (!storedOTP) throw new Error('OTP expired or invalid.');
    if (storedOTP.otp !== enteredOTP) throw new Error('Incorrect OTP.');

    OTPStorage.delete(userId); // Remove OTP after verification
    return true;
};

// Function to check if OTP is valid (expiry check)
const isOTPValid = (userId, otp) => {
    const storedOTP = OTPStorage.get(userId);
    if (!storedOTP) return false;
    if (storedOTP.otp !== otp) return false;
    if (Date.now() > storedOTP.expires) return false; // OTP expired

    return true;
};

module.exports = { generateOTP, sendOTP, storeOTP, verifyOTP, isOTPValid };
