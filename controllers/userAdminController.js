const userService = require('../services/userAdminService');

const getVerificationStatusCount = async (req, res) => {
  try {
    const counts = await userService.getVerificationStatusCount();

    res.status(200).json({
      success: true,
      message: 'User verification status counts retrieved successfully',
      data: {
        totalUsers: counts.total,
        verifiedUsers: counts.active,
        unverifiedUsers: counts.inactive
      }
    });
  } catch (err) {
    console.error('Error fetching verification count:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user verification status count',
      error: err.message
    });
  }
};

module.exports = {
  getVerificationStatusCount
};
