const payoutHistoryService = require('../services/payoutHistoryService');

// Get all payout history records
const getPayoutHistory = async (req, res) => {
    try {
        const payouts = await payoutHistoryService.getAllPayoutHistory();
        res.status(200).json({
            success: true,
            message: 'Fetched all payout history records successfully.',
            data: payouts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a specific payout history record by ID
const getPayoutHistoryById = async (req, res) => {
    try {
        const payout = await payoutHistoryService.getPayoutHistoryById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Payout history record fetched successfully.',
            data: payout
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getPayoutHistoryByUser = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const result = await payoutHistoryService.getPayoutHistoryUserById(userId, page, limit);

        if (!result.data.length) {
            return res.status(404).json({
                success: false,
                message: 'No payout history found for this user.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payout history fetched successfully.',
            data: result.data,
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete a payout history record
const deletePayoutHistory = async (req, res) => {
    try {
        const message = await payoutHistoryService.deletePayoutHistoryById(req.params.id);
        res.status(200).json({
            success: true,
            message: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getPayoutHistory,
    getPayoutHistoryById,
    deletePayoutHistory,
    getPayoutHistoryByUser
};