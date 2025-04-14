const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/userInvestmentcontroller');
const { validatePurchaseInvestment } = require('../validation/userInvestment');

router.post('/', authenticate, validatePurchaseInvestment, controller.purchasePlan);
router.get('/active', authenticate, controller.getActivePlans);
router.get('/completed', authenticate, controller.getCompletedPlans);

module.exports = router;