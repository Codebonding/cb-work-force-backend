const express = require('express');
const { registerUser, loginUser, initiateForgotPassword, resetPassword, changePassword } = require('../services/authService');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } = require('../validation/authValidation');
const { getUserById } = require('../controllers/authController');
const { validateUserId } = require('../validation/authValidation');

const router = express.Router();

router.post('/register', validateRegister, async (req, res) => {
    try {
        const response = await registerUser(req.body);
        if (response.success) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        const response = await loginUser(email, password);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});


router.get('/:userId', validateUserId, getUserById);

router.post('/forgot-password', validateForgotPassword, async (req, res) => {
    try {
        const response = await initiateForgotPassword(req.body.email);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Reset Password (Protected by JWT Token)
router.post('/reset-password', validateResetPassword, async (req, res) => {
    try {
        const response = await resetPassword(req.body.token, req.body.password);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

router.post('/change-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const response = await changePassword(req.user.userId, currentPassword, newPassword);

        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

module.exports = router;