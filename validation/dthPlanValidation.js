const Joi = require('joi');

const dthPlanSchema = Joi.object({
  dthId: Joi.string().uuid().required(),
  planName: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional().allow(''),
  validity: Joi.string().optional()
});

module.exports = { dthPlanSchema };