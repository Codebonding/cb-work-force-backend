const express = require('express');
const router = express.Router();
const dthController = require('../controllers/dthController');
const { isApprover } = require('../middleware/isApprover');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', isApprover,dthController.createDth);
router.get('/', authenticate, dthController.getAllDth);
router.get('/:id', isApprover,dthController.getDthById);
router.put('/:id', isApprover, dthController.updateDth);
router.delete('/:id', isApprover, dthController.deleteDth);

module.exports = router;