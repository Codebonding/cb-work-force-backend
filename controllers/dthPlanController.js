const {
  addPlan,
  getPlans,
  getPlansByDth,
  removePlan
} = require('../services/dthPlanService');

// Create
const createDthPlan = async (req, res) => {
  try {
    const plan = await addPlan(req.body);
    res.status(201).json({ success: true, message: 'DTH plan created.', data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create plan.', error: error.message });
  }
};

// All
const getAllDthPlans = async (req, res) => {
  try {
    const plans = await getPlans();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve plans.', error: error.message });
  }
};

// By DTH ID
const getDthPlansByDthId = async (req, res) => {
  try {
    const plans = await getPlansByDth(req.params.dthId);
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve plans.', error: error.message });
  }
};

// Delete
const deleteDthPlan = async (req, res) => {
  try {
    await removePlan(req.params.id);
    res.status(200).json({ success: true, message: 'Plan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete plan.', error: error.message });
  }
};

module.exports = {
  createDthPlan,
  getAllDthPlans,
  getDthPlansByDthId,
  deleteDthPlan
};