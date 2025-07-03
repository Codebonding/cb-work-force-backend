// services/investmentService.js
const InvestmentPlan = require('../models/InvestmentPlan');
const UserInvestment = require('../models/UserInvestment');
const UserFinancial = require('../models/UserFinancial');
const PayoutHistory = require('../models/PayoutHistory');
const User = require('../models/User');
const UserStatus = require('../models/UserStatus');
const {Op, literal } = require('sequelize');
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

    if (!userId || !investmentId) {
        throw new Error('Both userId and investmentId are required');
    }

    try {

        const userInvestment = await UserInvestment.findOne({
            where: { userId, id: investmentId }
        });


        if (!userInvestment || userInvestment.status !== 'active') {
            throw new Error('Investment not found or inactive');
        }

        const userFinancial = await UserFinancial.findOne({ where: { userId } });

        if (!userFinancial) {
            throw new Error('User financial record not found');
        }

        const investmentPlan = await InvestmentPlan.findOne({
            where: { id: userInvestment.investmentPlanId }
        });

        if (!investmentPlan) {
            throw new Error('Investment plan not found');
        }

        const payoutPerCycle = investmentPlan.payoutPerCycle;
        userFinancial.totalCommission += payoutPerCycle;
        userFinancial.accountBalance += payoutPerCycle;
        userFinancial.lastUpdated = new Date();
        await userFinancial.save();

        const payoutHistory = await PayoutHistory.create({
            userId,
            investmentId,
            payoutAmount: payoutPerCycle,
            payoutDate: new Date(),
            status: 'successful'
        });

        return { message: 'Payout successfully sent to user', payoutAmount: payoutPerCycle };
    } catch (error) {
        console.error('Error processing payout:', error.message);
        throw new Error('Error processing payout: ' + error.message);
    }
};

const updateInvestmentStatus = async (investmentId, status) => {
    try {
        const userInvestment = await UserInvestment.findOne({ where: { id: investmentId } });

        if (!userInvestment) {
            throw new Error('Investment not found');
        }

        // If already completed, no update
        if (userInvestment.status === 'completed') {
            return { message: 'Investment status is already completed, no update needed.' };
        }

        // Proceed only if status being updated to 'completed'
        if (status === 'completed') {
            const userFinancial = await UserFinancial.findOne({ where: { userId: userInvestment.userId } });

            if (!userFinancial) {
                throw new Error('User financial record not found');
            }

            // Update financial data
            userFinancial.accountBalance += userInvestment.investedAmount;
            userFinancial.totalInvestment -= userInvestment.investedAmount;
            userFinancial.lastUpdated = new Date();
            await userFinancial.save();
        }

        // Now update the investment status
        userInvestment.status = status;
        await userInvestment.save();

        return { message: `Investment status updated to ${status}` };
    } catch (error) {
        throw new Error('Error updating investment status: ' + error.message);
    }
};


const getAllRecentUsers = async (page = 1, limit = 10, search = '', active) => {
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } }
        ];
    }

    const attributes = {
        include: [
            [
                literal(`(
                    SELECT COUNT(*)
                    FROM \`UserInvestments\`
                    WHERE \`UserInvestments\`.\`userId\` = \`User\`.\`id\`
                )`),
                'investmentCount'
            ],
            [
                literal(`(
                    SELECT COUNT(*)
                    FROM \`UserInvestments\`
                    WHERE \`UserInvestments\`.\`userId\` = \`User\`.\`id\`
                    AND \`UserInvestments\`.\`status\` = 'active'
                )`),
                'activeInvestmentCount'
            ],
            [
                literal(`(
                    SELECT COUNT(*)
                    FROM \`Users\` AS \`Referral\`
                    WHERE \`Referral\`.\`referredBy\` = \`User\`.\`id\`
                )`),
                'referralCount'
            ]
        ]
    };

    const group = ['User.id', 'referrer.id', 'UserStatus.id'];

    let having = undefined;
    if (typeof active === 'boolean') {
        const activeInvestmentCountLiteral = `
            (
                SELECT COUNT(*)
                FROM \`UserInvestments\`
                WHERE \`UserInvestments\`.\`userId\` = \`User\`.\`id\`
                AND \`UserInvestments\`.\`status\` = 'active'
            )
        `;
        having = active
            ? literal(`${activeInvestmentCountLiteral} > 0`)
            : literal(`${activeInvestmentCountLiteral} = 0`);
    }

    const { rows: users, count: totalUsers } = await User.findAndCountAll({
        where,
        attributes,
        include: [
            {
                model: User,
                as: 'referrer',
                attributes: ['id', 'name', 'email'],
                required: false
            },
            {
                model: UserStatus,
                attributes: ['isOnline', 'isBlocked', 'lastLoginAt', 'lastLogoutAt'],
                required: false
            }
        ],
        group,
        having,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        subQuery: false
    });

    return {
        users,
        pagination: {
            totalUsers: Array.isArray(totalUsers) ? totalUsers.length : totalUsers,
            currentPage: page,
            totalPages: Math.ceil((Array.isArray(totalUsers) ? totalUsers.length : totalUsers) / limit),
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
