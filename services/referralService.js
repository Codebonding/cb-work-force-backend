const { Op } = require('sequelize');
const User = require('../models/User');
const Authorized = require('../models/Authorized');
const UserFinancial = require('../models/UserFinancial');

const BASE_URL = "https://www.codebondingworkforce.com/register"; // Change this based on your domain

const generateReferralLink = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'phone', 'referralCode', 'status', 'verify', 'createdAt'],
        });

        if (!user) throw new Error('User not found.');

        if (!user.referralCode) throw new Error('User does not have a referral code.');

        return { message: 'successfully Generate referral link', referralLink: `${BASE_URL}?ref=${user.referralCode}` };
        
    } catch (error) {
        throw new Error(error.message);
    }
};


const getUserReferrals = async (userId, page, limit, search, phone, status) => {
    try {
        page = isNaN(parseInt(page)) || page < 1 ? 1 : parseInt(page);
        limit = isNaN(parseInt(limit)) || limit < 1 ? 10 : parseInt(limit);
        const offset = (page - 1) * limit;

        // Ensure the user exists before proceeding
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'phone', 'referralCode', 'status', 'createdAt'],
        });

        if (!user) {
            return { error: true, message: 'User not found.' };
        }

        // Define filters for referral users
        let whereCondition = { referredBy: userId };
        if (search) Object.assign(whereCondition, { name: { [Op.like]: `%${search}%` } });
        if (phone) Object.assign(whereCondition, { phone: { [Op.like]: `%${phone}%` } });

        // Include `Authorized` table for verification status
        let includeCondition = {
            model: Authorized,
            as: 'authorized',
            attributes: ['verified']
        };

        // Filter by verification status if provided
        if (status) {
            includeCondition.where = { verified: status === "verified" };
        }

        // Fetch referrals with verification status
        const { count, rows: referrals } = await User.findAndCountAll({
            where: whereCondition,
            attributes: { exclude: ['password'] },
            include: [includeCondition],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

          // 🔄 Update totalReferral in UserFinancial
          await UserFinancial.update(
            { totalReferral: count },
            { where: { userId } }
        );

        return {
            referredByUser: user,
            totalReferrals: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            referrals,
            message: count === 0 ? "No referrals found for the given criteria." : undefined
        };
    } catch (error) {
        console.error("Error fetching user referrals:", error);
        return { error: true, message: error.message || "Something went wrong!" };
    }
};


module.exports = { getUserReferrals, generateReferralLink };
