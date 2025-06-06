const { Op } = require('sequelize');
const User = require('../models/User');
const UserFinancial  = require('../models/UserFinancial');
const  UserInvestment = require('../models/UserInvestment');
const  InvestmentPlan  = require('../models/InvestmentPlan');
const UserRewardHistory  = require('../models/UserRewardHistory');

const calculateEndDate = (startDate, durationValue, durationUnit) => {
  const endDate = new Date(startDate);  

  switch (durationUnit) {
    case 'month':
      endDate.setMonth(startDate.getMonth() + durationValue);  
      break;
    case 'day':
      endDate.setDate(startDate.getDate() + durationValue);  
      break;
    case 'year':
      endDate.setFullYear(startDate.getFullYear() + durationValue);  
      break;
    case 'hour':
      endDate.setHours(startDate.getHours() + durationValue);  
      break;
    case 'minute':
      endDate.setMinutes(startDate.getMinutes() + durationValue);  
      break;
    case 'second':
      endDate.setSeconds(startDate.getSeconds() + durationValue); 
      break;
    default:
      throw new Error('Unsupported duration unit');
  }

  return endDate;
};

exports.createInvestment = async (userId, investmentPlanId, createdBy) => {
  const plan = await InvestmentPlan.findByPk(investmentPlanId);

  if (!plan) throw new Error('Investment plan not found');

  if (plan.investmentAmount === 100) {
    const existingCount = await UserInvestment.count({
      where: {
        userId,
        investmentPlanId
      }
    });

    if (existingCount >= 2) {
      throw new Error('You can only purchase this ₹100 investment plan a maximum of 2 times.');
    }
  }

  const userFinancial = await UserFinancial.findOne({ where: { userId } });

  if (!userFinancial) throw new Error('User financial data not found');

  // Check if the user has enough balance
  if (userFinancial.accountBalance < plan.investmentAmount) {
    throw new Error('Insufficient account balance');
  }

  // Deduct the invested amount and update user financial data
  userFinancial.accountBalance -= plan.investmentAmount;
  userFinancial.totalInvestment += plan.investmentAmount;
  userFinancial.lastUpdated = new Date();
  await userFinancial.save();

    // ✅ Reward referrer with ₹3 if exists
  const user = await User.findByPk(userId);
  if (user?.referredBy) {
    const referrerFinancial = await UserFinancial.findOne({ where: { userId: user.referredBy } });
    if (referrerFinancial) {
      referrerFinancial.accountBalance += 2;
      referrerFinancial.lastUpdated = new Date();
      await referrerFinancial.save();

       await UserRewardHistory.create({
        userId: user.referredBy,
        referredUserId: userId,
        amount: 2,
        description: `Referral reward for ${userId}'s investment of ₹${plan.investmentAmount}`
      });
    }
  }

  const now = new Date();
  const endDate = calculateEndDate(now, plan.durationValue, plan.durationUnit);

  // Create the investment record
  return await UserInvestment.create({
    userId,
    investmentPlanId,
    startDate: now,
    endDate,
    investedAmount: plan.investmentAmount,
    expectedReturn: plan.totalReturn,
    status: 'active',
    createdBy,  // Set createdBy
  });
};


exports.getUserInvestmentsByStatus = async (userId, status) => {
  try {

    const investments = await UserInvestment.findAll({
      where: { userId, status },
      include: ['InvestmentPlan'],
    });
    console.log('Investments:', investments); // Log the result to check
    return investments;
  } catch (err) {
    throw new Error(`Error in fetching investments: ${err.message}`);
  }
};
