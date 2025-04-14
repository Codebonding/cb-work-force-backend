// services/KYCService.js
const { generateOTP, sendOTP, storeOTP, verifyOTP, isOTPValid } = require('../server/OTPService');
const User = require('../models/User');
const Authorized = require('../models/Authorized');
const { Op } = require('sequelize');

const createKYC = async (userId, aadharNumber, panNumber, address) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found. Please register first.');

    // Check if Aadhar or PAN already exists for another user
    const existingKYC = await Authorized.findOne({ where: { [Op.or]: [{ aadharNumber }, { panNumber }] } });
    if (existingKYC) throw new Error('Aadhar or PAN already exists.');

    // Create KYC record with verified: false
    const kycRecord = await Authorized.create({ userId, aadharNumber, panNumber, address, verified: false });

    // Generate & send OTP
    const otp = generateOTP();
    await sendOTP(user.email, otp);
    storeOTP(userId, otp, 5 * 60 * 1000); // Store OTP for 5 minutes

    return { message: 'OTP sent for verification. KYC will be activated after verification.', kycId: kycRecord.id };
};


const updateKYC = async (userId, aadharNumber, panNumber, address) => {

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found. Please register first.');

    const kycRecord = await Authorized.findOne({ where: { userId } });

    if (!kycRecord) throw new Error('KYC record not found.');

    // Check if Aadhar or PAN already exists for another user
    const existingKYC = await Authorized.findOne({ 
        where: { 
            userId: { [Op.ne]: userId }, // Exclude the current user
            [Op.or]: [{ aadharNumber }, { panNumber }] 
        } 
    });

    if (existingKYC) throw new Error('Aadhar or PAN already exists with another user.');

    // Update KYC but keep it unverified
    await kycRecord.update({ aadharNumber, panNumber, address, verified: false });

    // Generate & send OTP again for verification
    const otp = generateOTP();
    await sendOTP(user.email, otp);
    storeOTP(userId, otp, 5 * 60 * 1000);

    return { message: 'OTP sent for verification. KYC will be activated after verification.' };
};


const verifyKYC = async (userId, otp) => {
    if (!isOTPValid(userId, otp)) throw new Error('Invalid or expired OTP.');

    const kycRecord = await Authorized.findOne({ where: { userId } });
    if (!kycRecord) throw new Error('KYC record not found.');

    // Activate KYC after OTP verification
    await kycRecord.update({ verified: true });

    return { message: 'KYC verified successfully. You can now proceed with transactions.' };
};


const resendOTP = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found.');
    
    const otp = generateOTP();
    await sendOTP(user.email, otp);
    storeOTP(userId, otp, 5 * 60 * 1000);
    
    return { message: 'OTP resent successfully.' };
};

const getKYCStatus = async (userId) => {
    const kycRecord = await Authorized.findOne({ where: { userId } });
    
    if (!kycRecord) {
        return { status: 'not_submitted', message: 'KYC has not been submitted.' };
    }

    return {
        status: kycRecord.verified ? 'verified' : 'pending',
        message: kycRecord.verified ? 'KYC is verified.' : 'KYC is pending verification.'
    };
};


module.exports = { createKYC, updateKYC, verifyKYC, resendOTP, getKYCStatus };
