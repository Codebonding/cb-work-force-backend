const express = require('express');
const router = express.Router();
const adminController = require('../controllers/userAdminController');

const { isApprover } = require('../middleware/isApprover');

router.get('/verify-count',isApprover, adminController.getVerificationStatusCount);

module.exports = router;