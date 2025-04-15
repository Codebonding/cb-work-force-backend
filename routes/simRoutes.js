const express = require('express');
const router = express.Router();
const simController = require('../controllers/simController');
const { validateSim } = require('../validation/simValidation');
const { isApprover } = require('../middleware/isApprover');

router.post('/add', isApprover, validateSim,simController.addSim);
router.get('/',isApprover, simController.getAllSims);

module.exports = router;