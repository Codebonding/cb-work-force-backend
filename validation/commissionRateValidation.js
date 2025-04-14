const Joi = require('joi');

const commissionRateSchema = Joi.object({
  operatorCode: Joi.string().required(),
  userCommission: Joi.number().min(0).max(100).required(),
  referrerCommission: Joi.number().min(0).max(100).required()
});

module.exports = { commissionRateSchema };