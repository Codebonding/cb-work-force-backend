const express = require('express');
const router = express.Router();
const simController = require('../controllers/simController');
const { validateSim } = require('../validation/simValidation');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/add', authenticate, validateSim,simController.addSim);
router.get('/',authenticate, simController.getAllSims);

module.exports = router;