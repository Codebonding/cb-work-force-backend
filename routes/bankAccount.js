const express = require('express');
const router = express.Router();
const controller = require('../controllers/BankAccountController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, controller.create);
router.post('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);
router.get('/', authenticate, controller.getAll);

module.exports = router;