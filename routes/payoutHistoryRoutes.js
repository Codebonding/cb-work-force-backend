const express = require('express');
const router = express.Router();
const {
    getPayoutHistory,
    getPayoutHistoryById,
    deletePayoutHistory,
    getPayoutHistoryByUser
} = require('../controllers//payoutHistoryController');
const { isApprover } = require('../middleware/isApprover');  // Import the isApprover middleware

// Get all payout history
router.get('/', getPayoutHistory);

// Get a single payout history record by ID
router.get('/:id', getPayoutHistoryById);

// Delete a payout history record by ID (only accessible by an admin)
router.delete('/:id', isApprover, deletePayoutHistory);

router.get('/user/:userId', getPayoutHistoryByUser);

module.exports = router;