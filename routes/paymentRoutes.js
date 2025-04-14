const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const { validatePaymentPayload } = require('../validation/paymentValidation');
const { isApprover } = require('../middleware/isApprover');
// User: Create + View
router.post('/', authenticate, validatePaymentPayload, paymentController.createPayment);
router.get('/my', authenticate, paymentController.getUserPayments);

// Admin: Approve + Reject
router.post('/approve/:id', isApprover, paymentController.approvePayment);
router.post('/reject/:id',  isApprover, paymentController.rejectPayment);

// Admin: View all
router.get('/',  isApprover , paymentController.getAllPayments);

// Status by UTR
router.post('/status', paymentController.getPaymentStatus);

module.exports = router;