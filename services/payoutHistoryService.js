const PayoutHistory = require('../models/PayoutHistory');

// Get all payout history records
const getAllPayoutHistory = async () => {
    try {
        const payouts = await PayoutHistory.findAll();
        if (!payouts || payouts.length === 0) {
            throw new Error('No payout history records found.');
        }
        return payouts;
    } catch (error) {
        throw new Error('Error fetching all payout history: ' + error.message);
    }
};

// Get a specific payout history record by ID
const getPayoutHistoryById = async (id) => {
    try {
        const payout = await PayoutHistory.findByPk(id);
        if (!payout) {
            throw new Error('Payout history not found for the given ID');
        }
        return payout;
    } catch (error) {
        throw new Error('Error fetching payout history by ID: ' + error.message);
    }
};
// Get payout history records for a specific user
const getPayoutHistoryUserById = async (userId, page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await PayoutHistory.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']], // optional
            offset,
            limit
        });

        return {
            total: count,
            data: rows
        };
    } catch (error) {
        throw new Error('Error fetching payout history: ' + error.message);
    }
};


// Delete a payout history record
const deletePayoutHistoryById = async (id) => {
    try {
        const payout = await PayoutHistory.findByPk(id);
        if (!payout) {
            throw new Error('Payout history not found for the given ID');
        }
        await payout.destroy();
        return 'Payout history deleted successfully';
    } catch (error) {
        throw new Error('Error deleting payout history: ' + error.message);
    }
};

module.exports = {
    getAllPayoutHistory,
    getPayoutHistoryById,
    deletePayoutHistoryById,
    getPayoutHistoryUserById
};
