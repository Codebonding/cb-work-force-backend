const { fetchUserById } = require('../services/authService');

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await fetchUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = { getUserById };