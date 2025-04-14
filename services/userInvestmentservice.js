const { Op } = require('sequelize');
const UserFinancial  = require('../models/UserFinancial');
const  UserInvestment = require('../models/UserInvestment');
const  InvestmentPlan  = require('../models/InvestmentPlan');

const calculateEndDate = (startDate, durationValue, durationUnit) => {
  const endDate = new Date(startDate);  // Create a copy of startDate to avoid mutation

  switch (durationUnit) {
    case 'month':
      endDate.setMonth(startDate.getMonth() + durationValue);  // Add months
      break;
    case 'day':
      endDate.setDate(startDate.getDate() + durationValue);  // Add days
      break;
    case 'year':
      endDate.setFullYear(startDate.getFullYear() + durationValue);  // Add years
      break;
    case 'hour':
      endDate.setHours(startDate.getHours() + durationValue);  // Add hours
      break;
    case 'minute':
      endDate.setMinutes(startDate.getMinutes() + durationValue);  // Add minutes
      break;
    case 'second':
      endDate.setSeconds(startDate.getSeconds() + durationValue);  // Add seconds
      break;
    default:
      throw new Error('Unsupported duration unit');
  }

  return endDate;
};

exports.createInvestment = async (userId, investmentPlanId, createdBy) => {
  const plan = await InvestmentPlan.findByPk(investmentPlanId);

  if (!plan) throw new Error('Investment plan not found');

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
