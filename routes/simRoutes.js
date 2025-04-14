const express = require('express');
const router = express.Router();
const simController = require('../controllers/simController');
const { validateSim } = require('../validation/simValidation');

router.post('/add', validateSim,simController.addSim);
router.get('/', simController.getAllSims);

module.exports = router;