const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { dthPlanSchema } = require('../validation/dthPlanValidation');
const {
  createDthPlan,
  getAllDthPlans,
  getDthPlansByDthId,
  deleteDthPlan
} = require('../controllers/dthPlanController');

// Create DTH Plan
router.post('/', authenticate, async (req, res, next) => {
  const { error } = dthPlanSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}, createDthPlan);

// Get all plans
router.get('/', authenticate, getAllDthPlans);

// Get plans by DTH provider ID
router.get('/by-dth/:dthId', authenticate, getDthPlansByDthId);

// Delete a plan
router.delete('/:id', authenticate, deleteDthPlan);

module.exports = router;