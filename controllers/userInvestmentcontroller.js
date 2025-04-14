// const service = require('../services/userInvestmentService');
const userInvestmentservice = require('../services/userInvestmentservice');
exports.purchasePlan = async (req, res) => {
  try {
    // Attempt to create the investment
    const investment = await userInvestmentservice.createInvestment(req.user.userId, req.body.investmentPlanId, req.user.userId); // Pass createdBy (user creating investment)
    
    // If successful, respond with a success message and the investment details
    res.status(201).json({
      message: 'Investment plan successfully purchased!',
      investment: {
        id: investment.id,
        planId: investment.investmentPlanId,
        startDate: investment.startDate,
        endDate: investment.endDate,
        investedAmount: investment.investedAmount,
        expectedReturn: investment.expectedReturn,
        status: investment.status
      }
    });
  } catch (err) {
    // If an error occurs, handle it based on the error type
    if (err.message === 'Investment plan not found') {
      res.status(404).json({
        message: 'The requested investment plan could not be found. Please check the plan ID.',
        error: err.message
      });
    } else if (err.message === 'User financial data not found') {
      res.status(404).json({
        message: 'User financial data not found. Please ensure your account is properly set up.',
        error: err.message
      });
    } else if (err.message === 'Insufficient account balance') {
      res.status(400).json({
        message: 'Your account balance is insufficient to make this investment. Please add funds to your account.',
        error: err.message
      });
    } else {
      // For any other errors, send a generic message
      res.status(500).json({
        message: 'Failed to purchase the investment plan. Please try again later.',
        error: err.message
      });
    }
  }
};

exports.getActivePlans = async (req, res) => {
  try {
    const plans = await userInvestmentservice.getUserInvestmentsByStatus(req.user.userId, 'active');
    if (plans.length === 0) {
      return res.status(200).json({ message: 'No active investment plans found.' });
    }
    res.status(200).json({ 
      message: 'Active investment plans retrieved successfully.',
      plans 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching active investment plans. Please try again later.',
      error: err.message 
    });
  }
};

exports.getCompletedPlans = async (req, res) => {
  try {
    const plans = await userInvestmentservice.getUserInvestmentsByStatus(req.user.userId, 'completed');
    if (plans.length === 0) {
      return res.status(200).json({ message: 'No completed investment plans found.' });
    }
    res.status(200).json({
      message: 'Completed investment plans retrieved successfully.',
      plans
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching completed investment plans. Please try again later.',
      error: err.message
    });
  }
};
