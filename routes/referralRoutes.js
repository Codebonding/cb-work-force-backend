const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { validateReferralList } = require('../validation/referralValidation');
const { getUserReferrals, generateReferralLink } = require('../controllers/referralController');

const router = express.Router();

// Get paginated referral list with search & filters
router.get('/referrals', authenticate, validateReferralList, getUserReferrals);

// Generate referral link
router.get('/generate-link', authenticate, generateReferralLink);

module.exports = router;