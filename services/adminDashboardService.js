const { Sequelize, Op } = require('sequelize');
const moment = require('moment');
const User = require('../models/User');
const UserInvestment = require('../models/UserInvestment');
const UserFinancial = require('../models/UserFinancial');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const RechargeHistory = require('../models/RechargeHistory');
const InvestmentPlan = require('../models/InvestmentPlan');
const PayoutHistory = require('../models/PayoutHistory');

// Association
UserInvestment.belongsTo(InvestmentPlan, {
  foreignKey: 'investmentPlanId',
  as: 'investmentPlan',
});

const getTotalAdminDashboardStats = async () => {
  try {
    const today = moment.utc().startOf('day');
    const tomorrow = moment.utc().add(1, 'day').startOf('day');

    const totalUsers = await User.count();
    const totalInvestments = await UserInvestment.count();
    const activeInvestments = await UserInvestment.count({ where: { status: 'active' } });
    const completedInvestments = await UserInvestment.count({ where: { status: 'completed' } });

    const totalInvestmentAmountResult = await UserInvestment.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('investedAmount')), 'total']]
    });
    const totalInvestmentAmount = parseFloat(totalInvestmentAmountResult?.get('total') || 0);

    const totalActiveInvestmentAmountResult = await UserInvestment.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('investedAmount')), 'total']],
      where: { status: 'active' }
    });
    const totalActiveInvestmentAmount = parseFloat(totalActiveInvestmentAmountResult?.get('total') || 0);

    const financialTotals = await UserFinancial.findOne({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('accountBalance')), 'totalAccountBalance'],
        [Sequelize.fn('SUM', Sequelize.col('totalTransaction')), 'totalTransaction'],
        [Sequelize.fn('SUM', Sequelize.col('totalRechargePaid')), 'totalRechargePaid'],
        [Sequelize.fn('SUM', Sequelize.col('totalCommission')), 'totalCommission'],
      ]
    });

    const totalAccountBalance = parseFloat(financialTotals?.get('totalAccountBalance') || 0);
    const totalTransaction = parseFloat(financialTotals?.get('totalTransaction') || 0);
    const totalRechargePaid = parseFloat(financialTotals?.get('totalRechargePaid') || 0);
    const totalUserCommission = parseFloat(financialTotals?.get('totalCommission') || 0);

    const totalWithdrawalAmountResult = await WithdrawalRequest.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('withdrawalAmount')), 'total']],
      where: { status: 'approved' }
    });
    const totalWithdrawalAmount = parseFloat(totalWithdrawalAmountResult?.get('total') || 0);

    const todayWithdrawalAmountResult = await WithdrawalRequest.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('withdrawalAmount')), 'total']],
      where: {
        status: 'approved',
        updatedAt: {
          [Op.gte]: today.toDate(),
          [Op.lt]: tomorrow.toDate()
        }
      }
    });
    const todayWithdrawalAmount = parseFloat(todayWithdrawalAmountResult?.get('total') || 0);

    const todayRechargeResult = await RechargeHistory.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
      where: {
        createdAt: { [Op.gte]: today.toDate(), [Op.lt]: tomorrow.toDate() },
        status: 'success'
      }
    });
    const todayRechargeAmount = parseFloat(todayRechargeResult?.get('total') || 0);

    const rechargeCommissionTotals = await RechargeHistory.findOne({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('userCommission')), 'totalUserCommission'],
        [Sequelize.fn('SUM', Sequelize.col('referrerCommission')), 'totalReferrerCommission']
      ]
    });
    const totalRechargeUserCommission = parseFloat(rechargeCommissionTotals?.get('totalUserCommission') || 0);
    const totalRechargeReferrerCommission = parseFloat(rechargeCommissionTotals?.get('totalReferrerCommission') || 0);

    const investments = await UserInvestment.findAll({
      where: {
        status: 'active',
        startDate: { [Op.lte]: tomorrow.toDate() },
        endDate: { [Op.gte]: today.toDate() }
      },
      include: [{
        model: InvestmentPlan,
        as: 'investmentPlan',
        attributes: ['payoutPerCycle', 'payoutCycleValue', 'payoutCycleUnit']
      }]
    });

    let dailyTotalPayout = 0;
    for (const investment of investments) {
      const plan = investment.investmentPlan;
      const { payoutPerCycle, payoutCycleValue, payoutCycleUnit } = plan;

      const startDate = moment.utc(investment.startDate).startOf('day');
      const endDate = moment.utc(investment.endDate).endOf('day');

      if (today.isSame(startDate, 'day')) continue;
      if (today.isBefore(startDate) || today.isAfter(endDate)) continue;

      const diff = today.diff(startDate, payoutCycleUnit);
      if (diff % payoutCycleValue === 0) {
        dailyTotalPayout += parseFloat(payoutPerCycle || 0);
      }
    }

    const todayPayoutResult = await PayoutHistory.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('payoutAmount')), 'total']],
      where: {
        payoutDate: {
          [Op.gte]: today.toDate(),
          [Op.lt]: tomorrow.toDate()
        },
        status: 'successful'
      }
    });
    const todayPayoutAmount = parseFloat(todayPayoutResult?.get('total') || 0);

    return {
      totalUsers,
      totalInvestments,
      activeInvestments,
      completedInvestments,
      totalInvestmentAmount,
      totalActiveInvestmentAmount,
      totalAccountBalance,
      totalTransaction,
      totalRechargePaid,
      totalUserCommission,
      totalWithdrawalAmount,
      todayWithdrawalAmount, // ✅ Today-only withdrawal via `updatedAt`
      todayRechargeAmount,
      totalRechargeUserCommission,
      totalRechargeReferrerCommission,
      dailyTotalPayout,
      todayPayoutAmount
    };

  } catch (error) {
    console.error('Admin Dashboard Service Error:', error);
    throw new Error('Failed to fetch admin dashboard data');
  }
};

module.exports = {
  getTotalAdminDashboardStats
};
