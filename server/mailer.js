const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service provider
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS  // Your email password or app-specific password
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3001/api/users/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
        from: `CodeBonding Workforce <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email – CodeBonding Workforce',
        html: `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #ffffff;">
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to CodeBonding Workforce</h1>
        <div style="font-size: 48px; margin-top: 10px;">🚀</div>
    </div>
    
    <!-- Content container -->
    <div style="padding: 30px; color: #4a5568; line-height: 1.6;">
        <p style="margin-bottom: 25px;">Thanks for joining! To complete your registration and activate your account, please verify your email address:</p>
        
        <!-- Main CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15); transition: all 0.3s ease;">Verify My Email</a>
        </div>
        
        <p style="margin-bottom: 25px;">This link will expire in 24 hours. If you didn't request this, please ignore this email.</p>
        
        <div style="border-top: 1px solid #e2e8f0; margin: 30px 0; padding-top: 20px;">
            <p style="margin: 5px 0; color: #718096;">Need help? Reply to this email or contact our support team.</p>
        </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #64748b;">
        <p style="margin: 5px 0;"><strong>CodeBonding Workforce Team</strong></p>
        <p style="margin: 5px 0;">
            <a href="mailto:support@codebonding.com" style="color: #6e8efb; text-decoration: none;">📩 support@codebonding.com</a> | 
            <a href="https://www.codebonding.com" style="color: #6e8efb; text-decoration: none;">🌐 www.codebonding.com</a>
        </p>
        <p style="margin: 15px 0 0; font-size: 12px;">© 2023 CodeBonding. All rights reserved.</p>
    </div>
</div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = { sendVerificationEmail };
