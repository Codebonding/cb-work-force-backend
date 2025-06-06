// controllers/userRewardHistory.controller.js
const rewardService = require('../services/userRewardHistoryService');

exports.getUserRewardHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Optional: only allow users to access their own history
    if (req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this user data.' });
    }

    const history = await rewardService.getRewardHistoryByUserId(userId);

    res.status(200).json({
      success: true,
      message: 'Reward history fetched successfully',
      data: history
    });
  } catch (err) {
    console.error('Error fetching reward history:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reward history'
    });
  }
};
