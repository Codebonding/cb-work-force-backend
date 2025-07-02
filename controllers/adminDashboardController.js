const { getTotalAdminDashboardStats } = require('../services/adminDashboardService');

const fetchTotalAdminDashboard = async (req, res) => {
  try {
    const stats = await getTotalAdminDashboardStats();

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching admin dashboard data'
    });
  }
};

module.exports = {
  fetchTotalAdminDashboard
};