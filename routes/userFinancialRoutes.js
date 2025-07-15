const express = require('express');
const router = express.Router();
const controller = require('../controllers/userFinancialController');
const { authenticate } = require('../middleware/authMiddleware');

// Protected routes
router.get('/:userId', authenticate, controller.getUserFinancial);

router.get('/top/commission', authenticate, controller.getTopUserCommissions);

module.exports = router;