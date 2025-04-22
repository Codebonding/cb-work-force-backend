
const investmentService = require('../services/adminInvestmentService');

// Get users with active investments
exports.getUsersWithActiveInvestments = async (req, res) => {
    try {
        const activeUsers = await investmentService.getActiveUsers();

        if (!activeUsers || activeUsers.length === 0) {
            return res.status(404).json({ message: 'No active investments found' });
        }

        res.status(200).json(activeUsers);
    } catch (err) {
        console.error('Error fetching active users:', err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

exports.getActiveUserInvestment = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const result = await investmentService.getUserInvestment(userId, page, limit);

        if (!result.investments.length) {
            return res.status(404).json({ message: 'No active investment found for this user' });
        }

        res.status(200).json({
            data: result.investments,
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total
        });
    } catch (err) {
        console.error('Error fetching user investment:', err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};


exports.sendInvestmentPayout = async (req, res) => {
    const { userId, investmentId } = req.body; // Ensure the correct destructuring

    console.log("UserId: ", userId); // Debugging log
    console.log("InvestmentId: ", investmentId); // Debugging log

    try {
        // Validate that both userId and investmentId are provided
        if (!userId || !investmentId) {
            return res.status(400).json({ message: 'Both userId and investmentId are required.' });
        }

        const payoutResponse = await investmentService.sendPayout(userId, investmentId);
        res.status(200).json(payoutResponse);
    } catch (err) {
        console.error('Error processing payout:', err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

// Update investment status to completed
exports.updateInvestmentPlanStatus = async (req, res) => {
    const { investmentId, status } = req.body;
    try {
        const statusUpdateResponse = await investmentService.updateInvestmentStatus(investmentId, status);
        res.status(200).json(statusUpdateResponse);
    } catch (err) {
        console.error('Error updating investment status:', err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

exports.getAllRecentUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const { users, pagination } = await investmentService.getAllRecentUsers(page, limit, search);

        res.status(200).json({
            success: true,
            data: users,
            pagination
        });
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};