const ReferralService = require('../services/referralService');

const getUserReferrals = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10, search, phone, status } = req.query;
        
        const response = await ReferralService.getUserReferrals(userId, page, limit, search, phone, status);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const generateReferralLink = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId,"ghh");
        
        const response = await ReferralService.generateReferralLink(userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getUserReferrals, generateReferralLink };