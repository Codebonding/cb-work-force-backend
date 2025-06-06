const {
  processDTHRecharge,
  fetchUserDTHRechargeHistory,
} = require('../services/dthRechargeService');

const initiateDTHRecharge = async (req, res) => {
  try {
    const result = await processDTHRecharge(req.user.userId, req.body);

    const isSuccess = result.status === 'Success';
    const isPending = result.status === 'Pending';

    res.status(200).json({
      success: isSuccess,
      pending: isPending,
      message: isSuccess
        ? 'DTH recharge successful.'
        : isPending
        ? 'DTH recharge is pending. Please check back later.'
        : 'DTH recharge failed.',
      data: result
    });

  } catch (err) {
    console.error("DTH Recharge Error:", err.message);
    res.status(500).json({
      success: false,
      message: 'DTH recharge failed. Please try again later.',
      error: err.message
    });
  }
};

const getUserDTHRechargeHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await fetchUserDTHRechargeHistory(userId, page, limit);
    res.status(200).json({
      success: true,
      message: 'DTH recharge history retrieved successfully.',
      currentPage: page,
      totalPages: Math.ceil(result.count / limit),
      totalRecords: result.count,
      data: result.rows
    });
  } catch (error) {
    console.error("DTH Recharge History Error:", error.message || error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve DTH recharge history.',
      error: error.message || 'Internal server error.'
    });
  }
};


module.exports = {
  initiateDTHRecharge,
  getUserDTHRechargeHistory
};