const DthPlan = require('../models/DthPlan');

// Create
const addPlan = async (data) => {
  return await DthPlan.create(data);
};

// Get all
const getPlans = async () => {
  return await DthPlan.findAll({ order: [['createdAt', 'DESC']] });
};

// Get by DTH provider
const getPlansByDth = async (dthId) => {
  return await DthPlan.findAll({
    where: { dthId },
    order: [['createdAt', 'DESC']]
  });
};

// Delete by ID
const removePlan = async (id) => {
  const plan = await DthPlan.findByPk(id);
  if (!plan) throw new Error('Plan not found');
  return await plan.destroy();
};

module.exports = {
  addPlan,
  getPlans,
  getPlansByDth,
  removePlan
};