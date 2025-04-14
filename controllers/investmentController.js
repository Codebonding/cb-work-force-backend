const investmentService = require('../services/investmentService');

exports.createPlan = async (req, res) => {
    try {
        const createdBy = req.user.userId;
        const plan = await investmentService.createPlan(req.body, createdBy);
        res.status(201).json({
            success: true,
            message: 'Investment plan created successfully',
            data: plan
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create investment plan',
            error: err.message
        });
    }
};

exports.getInvestmentPlans = async (req, res) => {
    try {
      const plans = await investmentService.getAllPlans();
  
      if (!plans || plans.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No investment plans found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Investment plans fetched successfully',
        data: plans,
      });
    } catch (err) {
      console.error('Error fetching investment plans:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching investment plans',
        error: err.message,
      });
    }
  };


exports.getPlan = async (req, res) => {
    try {
        const plan = await investmentService.getPlanById(req.params.id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Investment plan not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Investment plan fetched successfully',
            data: plan
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch investment plan',
            error: err.message
        });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const updatedBy = req.user.userId;
        const updated = await investmentService.updatePlan(req.params.id, req.body, updatedBy);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Investment plan not found or could not be updated'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Investment plan updated successfully',
            data: updated
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update investment plan',
            error: err.message
        });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const deleted = await investmentService.deletePlan(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Investment plan not found or already deleted'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Investment plan deleted successfully',
            data: deleted
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete investment plan',
            error: err.message
        });
    }
};
