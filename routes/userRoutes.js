const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../controllers/userController');  // Assuming you have these in the controller

router.get('/verify-email', verifyEmail);

module.exports = router;