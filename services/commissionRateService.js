const CommissionRate = require('../models/CommissionRate');

const createCommissionRate = async ({ operatorCode, userCommission, referrerCommission }) => {
  return await CommissionRate.create({ operatorCode, userCommission, referrerCommission });
};

const updateCommissionRate = async (id, { userCommission, referrerCommission }) => {
  const rate = await CommissionRate.findByPk(id);
  if (!rate) return null;
  rate.userCommission = userCommission;
  rate.referrerCommission = referrerCommission;
  await rate.save();
  return rate;
};

const getAllCommissionRates = async () => {
  return await CommissionRate.findAll();
};

const getCommissionRateByOperator = async (operator) => {
  return await CommissionRate.findOne({ where: { operator } });
};

module.exports = {
  createCommissionRate,
  updateCommissionRate,
  getAllCommissionRates,
  getCommissionRateByOperator
};