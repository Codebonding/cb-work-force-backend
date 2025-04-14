const express = require('express');
const router = express.Router();
const { isApprover } = require('../middleware/isApprover');
const { commissionRateSchema } = require('../validation/commissionRateValidation');
const {
  createCommissionRate,
  updateCommissionRate,
  getAllCommissionRates,
  getCommissionRateByOperator
} = require('../controllers/commissionRateController');

// Create
router.post('/', isApprover, async (req, res, next) => {
    console.log(req.body);
    
  const { error } = commissionRateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}, createCommissionRate);

// Update
router.put('/:id', isApprover, updateCommissionRate);

// Get all
router.get('/', isApprover, getAllCommissionRates);

// Get by operator
router.get('/:operator', isApprover, getCommissionRateByOperator);

module.exports = router;