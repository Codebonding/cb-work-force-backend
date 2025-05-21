const User  = require('../models/User'); // Assuming you have the User model correctly set up

const verifyEmail = async (req, res) => {
    const { token, email } = req.query;

    if (!token || !email) {
        return res.status(400).json({ success: false, message: 'Invalid verification token or email' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Log values for debugging
        console.log("Stored Token:", user.verificationToken);
        console.log("Received Token:", token);

        // Check if the provided token matches the stored token
        if (token !== user.verificationToken) {
            return res.status(400).json({ success: false, message: 'Your email is already verified. Please log in to continue.' });
        }

        // Mark the user as verified
        user.verify = true;
        user.verificationToken = null; // Clear token after successful verification
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


module.exports = { verifyEmail };
