const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/adminInvestmentController');
const { isApprover } = require('../middleware/isApprover'); // Import the approver middleware
const { validateInvestmentPayout, validateInvestmentStatusUpdate } = require('../validation/adminInvestmentValidation');

// Route to get users with active investments (No admin access needed)
router.get('/active-users', investmentController.getUsersWithActiveInvestments);

// Route to get the active investment details of a user (No admin access needed)
router.get('/user-investment/:userId', investmentController.getActiveUserInvestment);

// Route to send investment payout based on the plan (Admin access required)
router.post('/send-payout', isApprover, validateInvestmentPayout, investmentController.sendInvestmentPayout);

// Route to update the investment plan status to completed (Admin access required)
router.post('/update-investment-status', isApprover, validateInvestmentStatusUpdate, investmentController.updateInvestmentPlanStatus);

router.get('/recent',isApprover, investmentController.getAllRecentUsers);

module.exports = router;