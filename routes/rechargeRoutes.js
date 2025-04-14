const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { rechargeSchema } = require('../validation/rechargeValidation');
const { initiateRecharge, getReferrerCommissionHistory, getUserCommissionHistory, getUserRechargeHistory } = require('../controllers/rechargeController');

router.post('/', authenticate, async (req, res, next) => {
    const { error } = rechargeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
}, initiateRecharge);

router.get('/history-for-user', authenticate, getUserRechargeHistory);

router.get('/user-commissions', authenticate, getUserCommissionHistory);

router.get('/referrer-earnings', authenticate, getReferrerCommissionHistory);

module.exports = router;