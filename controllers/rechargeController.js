const {
    processRecharge,
    fetchUserRechargeHistory,
    fetchUserCommissionHistory,
    fetchReferrerCommissionHistory
  } = require('../services/rechargeService');

  const initiateRecharge = async (req, res) => {
    try {
      const result = await processRecharge(req.user.userId, req.body);
  
      const isSuccess = result.status === 'Success';
      const isPending = result.status === 'Pending';
  
      res.status(200).json({
        success: isSuccess,
        pending: isPending,
        message: isSuccess
          ? 'Recharge successful.'
          : isPending
          ? 'Recharge is pending. Please check back later.'
          : 'Recharge failed.',
        data: result
      });
  
    } catch (err) {
      console.error("Recharge Error:", err.message);
      res.status(500).json({
        success: false,
        message: 'Recharge failed. Please try again later.',
        error: err.message
      });
    }
  };
  
  const getUserRechargeHistory = async (req, res) => {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const result = await fetchUserRechargeHistory(userId, page, limit);
      res.status(200).json({
        success: true,
        message: 'Recharge history retrieved successfully.',
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
        totalRecords: result.count,
        data: result.rows
      });
    } catch (error) {
      console.error("Recharge History Error:", error.message || error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recharge history.',
        error: error.message || 'Internal server error.'
      });
    }
  };
  
  const getUserCommissionHistory = async (req, res) => {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const result = await fetchUserCommissionHistory(userId, page, limit);
      res.status(200).json({
        success: true,
        message: 'User commission history retrieved successfully.',
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
        totalRecords: result.count,
        data: result.rows
      });
    } catch (error) {
      console.error("User Commission History Error:", error.message || error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user commission history.',
        error: error.message || 'Internal server error.'
      });
    }
  };
  
  const getReferrerCommissionHistory = async (req, res) => {
    try {
      const referrerId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const result = await fetchReferrerCommissionHistory(referrerId, page, limit);
      res.status(200).json({
        success: true,
        message: 'Referrer commission history retrieved successfully.',
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
        totalRecords: result.count,
        data: result.rows
      });
    } catch (error) {
      console.error("Referrer Commission History Error:", error.message || error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve referrer commission history.',
        error: error.message || 'Internal server error.'
      });
    }
  };
  
  
  
  module.exports = {
    initiateRecharge,
    getUserRechargeHistory,
    getUserCommissionHistory,
    getReferrerCommissionHistory
  };
  