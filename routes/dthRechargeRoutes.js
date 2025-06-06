const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { rechargeSchema } = require('../validation/rechargeValidation'); // Updated for DTH
const {
    initiateDTHRecharge,
    getUserDTHRechargeHistory
} = require('../controllers/dthRechargeController');

// 🔄 DTH Recharge
router.post('/dth', authenticate, async (req, res, next) => {
    const { error } = rechargeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
}, initiateDTHRecharge);

// 📜 DTH Recharge History for Logged-in User
router.get('/dth/history-for-user', authenticate, getUserDTHRechargeHistory);


module.exports = router;
