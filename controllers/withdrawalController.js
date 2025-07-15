const withdrawalService = require('../services/WithdrawalService');

const createWithdrawal = async (req, res) => {
  try {
    const { bankAccount, ifscCode, branch, withdrawalAmount } = req.body;
    const userId = req.user?.userId;

    if (!userId || !bankAccount || !ifscCode || !branch || !withdrawalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, bankAccount, IFSC code, branch, or amount.'
      });
    }

    const newRequest = await withdrawalService.createWithdrawalRequest({
      userId,
      bankAccount,
      ifscCode,
      branch,
      withdrawalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully.',
      data: newRequest
    });
  } catch (err) {
    console.error('Create withdrawal error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create withdrawal request.'
    });
  }
};

const getAllWithdrawals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: data, count: total } = await withdrawalService.getAllWithdrawalRequests(userId, offset, limit);

    res.status(200).json({
      success: true,
      message: 'Fetched withdrawal requests.',
      data,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get withdrawals error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch withdrawal requests.'
    });
  }
};

const getAllAdminWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status || null,
      search: req.query.search || null
    };

    const { rows: data, count: total } = await withdrawalService.getAllAdminWithdrawalRequests(offset, limit, filters);

    res.status(200).json({
      success: true,
      message: 'Fetched withdrawal requests.',
      data,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get withdrawals error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch withdrawal requests.'
    });
  }
};


const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access. Admin ID missing.'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use "approved" or "rejected".'
      });
    }

    const updatedRequest = await withdrawalService.updateWithdrawalStatus(id, status, adminId);

    res.status(200).json({
      success: true,
      message: `Withdrawal status updated to '${status}'`,
      data: updatedRequest
    });
  } catch (err) {
    console.error('Approve withdrawal error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update withdrawal status.'
    });
  }
};

const getWithdrawalWithHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await withdrawalService.getWithdrawalRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Withdrawal request fetched successfully.',
      data: request
    });
  } catch (err) {
    console.error('Get withdrawal with history error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch withdrawal request.'
    });
  }
};

module.exports = {
  createWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  getWithdrawalWithHistory,
  getAllAdminWithdrawals
};
