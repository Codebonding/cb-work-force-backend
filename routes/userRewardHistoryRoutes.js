// routes/userRewardHistory.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userRewardHistoryController');
const { authenticate } = require('../middleware/authMiddleware'); // adjust path

router.get('/', authenticate, controller.getUserRewardHistory);

module.exports = router;