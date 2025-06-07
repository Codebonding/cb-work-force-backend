const rewardService = require('../services/userRewardHistoryService');

exports.getUserRewardHistory = async (req, res) => {
  try {
     const userId = req.user.userId; // taken from token

    // Only allow users to access their own history
    if (req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this user data.' });
    }

    // Pagination params with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await rewardService.getRewardHistoryByUserId(userId, limit, offset);

    res.status(200).json({
      success: true,
      message: 'Reward history fetched successfully',
      data: rows,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit
      }
    });
  } catch (err) {
    console.error('Error fetching reward history:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reward history'
    });
  }
};
