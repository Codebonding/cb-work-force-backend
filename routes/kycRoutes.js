const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { validateKYC, validateOTP } = require('../validation/kycValidation');
const { createKYC, updateKYC, verifyKYC, resendOTP, getKYCStatus } = require('../controllers/KYCController');

const router = express.Router();

router.post('/create', authenticate, validateKYC, createKYC);
router.post('/update', authenticate, validateKYC, updateKYC);
router.post('/verify-otp', authenticate, validateOTP, verifyKYC);
router.post('/resend-otp', authenticate, resendOTP);
router.get('/status', authenticate, getKYCStatus);


module.exports = router;
