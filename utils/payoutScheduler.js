// cronJobs/investmentPayoutCron.js
const cron = require('node-cron');
const { Op } = require('sequelize');
const UserInvestment = require('../models/UserInvestment');
const UserPayout = require('../models/UserPayout');
const UserFinancial = require('../models/UserFinancial');
const InvestmentPlan = require('../models/InvestmentPlan');

function getSeconds(unit) {
  return {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    month: 2592000,
    year: 31536000
  }[unit];
}

function addTime(date, value, unit) {
  const d = new Date(date);
  switch (unit) {
    case 'second': d.setSeconds(d.getSeconds() + value); break;
    case 'minute': d.setMinutes(d.getMinutes() + value); break;
    case 'hour': d.setHours(d.getHours() + value); break;
    case 'day': d.setDate(d.getDate() + value); break;
    case 'month': d.setMonth(d.getMonth() + value); break;
    case 'year': d.setFullYear(d.getFullYear() + value); break;
  }
  return d;
}

module.exports = () => {
  cron.schedule('*/5 * * * * *', async () => {  // Every 5 seconds
    try {
      console.log('✅ Cron triggered:', new Date());
      if (process.env.MAINTENANCE_MODE === 'true') return;

      const now = new Date();
      const dueInvestments = await UserInvestment.findAll({
        where: {
          status: 'active',
          nextPayoutAt: { [Op.lte]: now }
        },
        include: [InvestmentPlan]
      });

      for (const inv of dueInvestments) {
        const plan = inv.InvestmentPlan;
        const financial = await UserFinancial.findOne({ where: { userId: inv.userId } });

        const payoutPerCycle = plan.profit / (
          (plan.durationValue * getSeconds(plan.durationUnit)) /
          (plan.payoutCycleValue * getSeconds(plan.payoutCycleUnit))
        );

        await UserPayout.create({
          userId: inv.userId,
          investmentId: inv.id,
          payoutAmount: payoutPerCycle,
          payoutDate: new Date()
        });

        financial.accountBalance += payoutPerCycle;
        financial.totalPayout += payoutPerCycle;
        await financial.save();

        const next = addTime(now, plan.payoutCycleValue, plan.payoutCycleUnit);
        inv.nextPayoutAt = next;
        if (inv.endDate <= now) inv.status = 'completed';
        await inv.save();

        console.log(`💸 Payout of ₹${payoutPerCycle} updated for user ${inv.userId}`);
      }
    } catch (err) {
      console.error('❌ Cron error:', err.message);
    }
  });
};