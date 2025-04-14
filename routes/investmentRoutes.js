const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { authenticate } = require('../middleware/authMiddleware');
const {
    createInvestmentPlanSchema,
    updateInvestmentPlanSchema
} = require('../validation/investmentValidation');

// Middleware for Joi
const validateCreate = (req, res, next) => {
    const { error } = createInvestmentPlanSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
};

const validateUpdate = (req, res, next) => {
    const { error } = updateInvestmentPlanSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
};

// Routes
router.post('/', authenticate, validateCreate, investmentController.createPlan);
router.get('/', authenticate, investmentController.getInvestmentPlans);
router.get('/:id', authenticate, investmentController.getPlan);
router.put('/:id', authenticate, validateUpdate, investmentController.updatePlan);
router.delete('/:id', authenticate, investmentController.deletePlan);

module.exports = router;