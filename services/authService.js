const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Authorized = require('../models/Authorized');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { sendVerificationEmail } = require('../server/mailer');
const UserStatus = require('../models/UserStatus');
const UserFinancial = require('../models/UserFinancial');

const generateReferralCode = () => crypto.randomBytes(4).toString('hex').toUpperCase(); // Example: "A1B2C3D4"

const registerUser = async (userData) => {
    try {
        const { name, email, password, phone, referralCode } = userData;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return { success: false, message: 'Email already in use' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let referredBy = null;

        if (referralCode) {
            // Find the referrer user by referral code
            const referrer = await User.findOne({ where: { referralCode } });
            if (referrer) {
                referredBy = referrer.id;
            } else {
                return { success: false, message: 'Invalid referral code' };
            }
        }

        // Generate a unique referral code for the new user
        let newReferralCode;
        let isUnique = false;
        while (!isUnique) {
            newReferralCode = generateReferralCode();
            const existingCode = await User.findOne({ where: { referralCode: newReferralCode } });
            if (!existingCode) {
                isUnique = true;
            }
        }

        // Create the user without a verification token initially
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            referralCode: newReferralCode,
            referredBy,
            verify: false,
        });

        // ✅ Create UserFinancial record immediately after registration
        await UserFinancial.create({
            userId: user.id,
            accountBalance: 0,
            totalCommission: 0,
            totalRechargePaid: 0,
            totalReferral:0,
            totalTransaction:0,
            lastUpdated: new Date()
        });

        // Generate verification token
        const verificationToken = crypto
            .createHash('sha256')
            .update(email + user.createdAt.getTime().toString())
            .digest('hex');

        user.verificationToken = verificationToken;
        await user.save();

        // Send the verification email
        await sendVerificationEmail(email, verificationToken);

        return {
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                referralCode: user.referralCode,
                referredBy: user.referredBy,
                createdAt: user.createdAt
            }
        };
    } catch (error) {
        return { success: false, message: 'Registration failed', error: error.message };
    }
};


const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!user.verify) {
            return {
                success: false,
                message: 'User is not verified. Please verify your account first. If you haven\'t received the email, please check your spam or junk folder.'
            };
        }
        
        const status = await UserStatus.findOne({ where: { userId: user.id } });
        if (status?.isBlocked) return { success: false, message: 'Account is blocked' };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

         await UserStatus.upsert({
            userId: user.id,
            isOnline: true,
            lastLoginAt: new Date()
        });

        const accessToken = jwt.sign({ userId: user.id, name : user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
        const refreshToken = jwt.sign({ userId: user.id, name : user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                referralCode: user.referralCode,
                referredBy: user.referredBy
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    } catch (error) {
        return { success: false, message: 'Login failed', error: error.message };
    }
};


const fetchUserById = async (userId) => {
    return await User.findOne({
        where: { id: userId },
        attributes: ['id', 'name', 'email', 'phone', 'referralCode', 'status','createdAt'],
        include: [
            {
                model: User,
                as: 'referrer',
                attributes: ['name'], // Fetch referred by name
            },
            {
                model: Authorized,
                as: 'authorized',
                attributes: ['aadharNumber', 'panNumber', 'address', 'verified'],
            }
        ]
    });
};


// Initiate Forgot Password
const initiateForgotPassword = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Create a reset token
        const resetToken = jwt.sign(
            { email: user.email, id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"CodeBonding Workforce" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Reset Your Password - CodeBonding Workforce',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                  <h2 style="color: #2c3e50;">Password Reset Request</h2>
                  <p>Hi ${user.name || ''},</p>
                  <p>You requested to reset your password for your <strong>CodeBonding Workforce</strong> account. Click the button below to set a new password:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block;">Reset Password</a>
                  </div>
                  <p>This link will expire in 1 hour. If you didn’t request this, no action is needed.</p>
                  <p>Thanks,<br>The CodeBonding Workforce Team</p>
                  <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;">
                  <p style="font-size: 12px; color: #777;">If the button doesn’t work, paste this link into your browser:<br>${resetLink}</p>
                </div>
            `,
        });

        return { success: true, message: 'Reset link sent to email' };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'Error initiating password reset',
            error: error.message,
        };
    }
};

// Reset Password
const resetPassword = async (token, newPassword) => {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        return { success: true, message: 'Password reset successful' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Invalid token or error resetting password', error: error.message };
    }
};

const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        // Find the user by ID
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Compare the current password with the stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return { success: false, message: 'Incorrect current password' };
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error changing password', error: error.message };
    }
};


module.exports = { registerUser, loginUser, fetchUserById, initiateForgotPassword, resetPassword , changePassword};