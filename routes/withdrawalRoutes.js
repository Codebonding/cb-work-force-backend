const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { authenticate } = require('../middleware/authMiddleware');
const { isApprover } = require('../middleware/isApprover');
const { createWithdrawalSchema, updateStatusSchema } = require('../validation/withdrawalValidation');

const validateRequest = (schema) => (req, res, next) => {
  console.log('Request body:', req.body); 
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

router.post(
  '/',
  authenticate,
  validateRequest(createWithdrawalSchema),
  withdrawalController.createWithdrawal
);

router.post(
  '/:id/status',
  // authenticate,
  isApprover,
  validateRequest(updateStatusSchema),
  withdrawalController.approveWithdrawal
);

router.get(
  '/history',
  authenticate,
  withdrawalController.getWithdrawalWithHistory
);

router.get(
  '/',
  authenticate,
  withdrawalController.getAllWithdrawals
);

router.get(
  '/',
  isApprover,
  withdrawalController.getAllWithdrawals
);

module.exports = router;