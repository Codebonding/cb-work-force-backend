const { fetchUserById } = require('../services/authService');
const adminService = require('../services/adminService');

// 🔒 Block or Unblock a User
exports.blockOrUnblockUser = async (req, res) => {
  try {
    const { userId, block, reason } = req.body;

    const response = await adminService.blockOrUnblockUser(userId, block, reason);
    res.status(response.status).json(response.body);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Controller error while blocking/unblocking user',
      error: error.message
    });
  }
};


// 🔒 Log out a User (sets isOnline = false)
exports.logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log(req.body,"fvgvf****************");
        
        const response = await adminService.logoutUser(userId);
        res.status(response.status).json(response.body);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout controller error',
            error: error.message
        });
    }
};

exports.getAllBlockStatuses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', block } = req.query;

    // Convert block to boolean or undefined
    const blockFilter = block === 'true' ? true : block === 'false' ? false : undefined;

    const response = await adminService.getAllBlockStatuses(
      parseInt(page),
      parseInt(limit),
      search,
      blockFilter
    );

    res.status(response.status).json(response.body);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Status fetch error',
      error: error.message
    });
  }
};


// ✅ Public: Get User by ID (used in frontend/user profile)
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await fetchUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user',
            error: error.message
        });
    }
};
