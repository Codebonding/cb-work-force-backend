const Plan = require('../models/Plan');

exports.createPlan = async (data) => await Plan.create(data);
exports.getPlansBySim = async (simId) => await Plan.findAll({ where: { simId } });
exports.getPlansByType = async (type) => await Plan.findAll({ where: { planType: type } });