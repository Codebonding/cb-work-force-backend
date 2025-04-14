const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateAdminPayload } = require('../validation/adminValidation');

// Register new admin using userId
router.post('/register', validateAdminPayload, adminController.register);

// Login using userId
router.post('/login', validateAdminPayload, adminController.login);

module.exports = router;
