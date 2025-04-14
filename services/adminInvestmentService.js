// services/investmentService.js
const InvestmentPlan = require('../models/InvestmentPlan');
const UserInvestment = require('../models/UserInvestment');
const UserFinancial = require('../models/UserFinancial');
const PayoutHistory = require('../models/PayoutHistory');
const User = require('../models/User');
// Fetch all users with active investments
const getActiveUsers = async () => {
    try {
        const activeUsers = await UserInvestment.findAll({
            where: { status: 'active' },
            include: [
                {
                    model: InvestmentPlan,
                    attributes: ['planName', 'profit']
                }
            ],
            order: [['createdAt', 'DESC']] // Sorts by most recent first
        });
        

        return activeUsers;
    } catch (error) {
        throw new Error('Error fetching active users: ' + error.message);
    }
};

const getUserInvestment = async (userId, page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await UserInvestment.findAndCountAll({
            where: { userId },
            include: [{ model: InvestmentPlan }],
            offset,
            limit
        });

        return {
            total: count,
            investments: rows
        };
    } catch (error) {
        throw new Error('Error fetching user investment details: ' + error.message);
    }
};

const sendPayout = async (userId, investmentId) => {
    console.log(userId, investmentId, "gfgf");

    if (!userId || !investmentId) {
        throw new Error('Both userId and investmentId are required');
    }

    try {
        console.log('Received userId:', userId, 'investmentId:', investmentId);

        const userInvestment = await UserInvestment.findOne({
            where: { userId, id: investmentId }
        });

        console.log(userInvestment, "fdfd");

        if (!userInvestment || userInvestment.status !== 'active') {
            throw new Error('Investment not found or inactive');
        }

        const userFinancial = await UserFinancial.findOne({ where: { userId } });

        console.log(userFinancial, "fdf");

        if (!userFinancial) {
            throw new Error('User financial record not found');
        }

        console.log(userInvestment.investmentPlanId, "fggf");

        const investmentPlan = await InvestmentPlan.findOne({
            where: { id: userInvestment.investmentPlanId }
        });

        console.log(investmentPlan, "fdfg");

        if (!investmentPlan) {
            throw new Error('Investment plan not found');
        }

        const payoutPerCycle = investmentPlan.payoutPerCycle;
        userFinancial.totalCommission += payoutPerCycle;
        userFinancial.accountBalance += payoutPerCycle;
        userFinancial.lastUpdated = new Date();
        await userFinancial.save();

        // Track the payout in the PayoutHistory table
        const payoutHistory = await PayoutHistory.create({
            userId,
            investmentId,
            payoutAmount: payoutPerCycle,
            payoutDate: new Date(),
            status: 'successful'
        });

        console.log('Payout history recorded:', payoutHistory);

        return { message: 'Payout successfully sent to user', payoutAmount: payoutPerCycle };
    } catch (error) {
        console.error('Error processing payout:', error.message);
        throw new Error('Error processing payout: ' + error.message);
    }
};

// Update investment status
const updateInvestmentStatus = async (investmentId, status) => {
    try {
        const userInvestment = await UserInvestment.findOne({ where: { id: investmentId } });

        if (!userInvestment) {
            throw new Error('Investment not found');
        }

        // Check if the status is already "completed"
        if (userInvestment.status === 'completed') {
            return { message: 'Investment status is already completed, no update needed.' };
        }

        // Update status if it's not already "completed"
        userInvestment.status = status;
        await userInvestment.save();

        return { message: `Investment status updated to ${status}` };
    } catch (error) {
        throw new Error('Error updating investment status: ' + error.message);
    }
};


const getAllRecentUsers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const { rows: users, count: totalUsers } = await User.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        include: [{ model: User, as: 'referrer', attributes: ['id', 'name', 'email'] }]
    });

    return {
        users,
        pagination: {
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
        }
    };
};


module.exports = {
    getActiveUsers,
    getUserInvestment,
    sendPayout,
    getAllRecentUsers,
    updateInvestmentStatus
};
