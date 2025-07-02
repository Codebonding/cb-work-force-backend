const express = require('express');
const router = express.Router();
const { fetchTotalAdminDashboard } = require('../controllers/adminDashboardController');
const { isApprover } = require('../middleware/isApprover');

// Example route: GET /api/users/count
router.get('/', isApprover, fetchTotalAdminDashboard);

module.exports = router;