const Joi = require('joi');

const rechargeSchema = Joi.object({
    number: Joi.string().required(),
    amount: Joi.number().positive().required(),
    operatorCode: Joi.string().required(),
    circleCode: Joi.string().required(),
});

module.exports = { rechargeSchema };