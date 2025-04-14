const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { validatePlan } = require('../validation/planValidation');

router.post('/add', validatePlan,planController.addPlan);
router.get('/sim/:simId', planController.getPlansBySim);
router.get('/type/:type', planController.getPlansByType);

module.exports = router;