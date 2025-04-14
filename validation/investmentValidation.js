const Joi = require('joi');

const createInvestmentPlanSchema = Joi.object({
    planName: Joi.string().required().messages({
        'string.base': 'Plan name must be a string',
        'string.empty': 'Plan name is required',
        'any.required': 'Plan name is required'
    }),
    investmentAmount: Joi.number().positive().required().messages({
        'number.base': 'Investment amount must be a number',
        'number.positive': 'Investment amount must be positive',
        'any.required': 'Investment amount is required'
    }),
    durationValue: Joi.number().integer().positive().required().messages({
        'number.base': 'Duration value must be a number',
        'number.integer': 'Duration value must be an integer',
        'number.positive': 'Duration value must be positive',
        'any.required': 'Duration value is required'
    }),
    durationUnit: Joi.string().valid('second', 'minute', 'hour', 'day', 'month', 'year').required().messages({
        'any.only': 'Duration unit must be one of second, minute, hour, day, month, or year',
        'any.required': 'Duration unit is required'
    }),

    payoutCycleValue: Joi.number().integer().positive().required().messages({
        'number.base': 'Payout cycle value must be a number',
        'number.integer': 'Payout cycle value must be an integer',
        'number.positive': 'Payout cycle value must be positive',
        'any.required': 'Payout cycle value is required'
    }),
    payoutCycleUnit: Joi.string().valid('second', 'minute', 'hour', 'day', 'month', 'year').required().messages({
        'any.only': 'Payout cycle unit must be one of second, minute, hour, day, month, or year',
        'any.required': 'Payout cycle unit is required'
    }),

    profit: Joi.number().positive().required().messages({
        'number.base': 'Profit must be a number',
        'number.positive': 'Profit must be positive',
        'any.required': 'Profit is required'
    }),

    payoutPerCycle: Joi.number().positive().optional().messages({
        'number.base': 'Payout per cycle must be a number',
        'number.positive': 'Payout per cycle must be positive'
    }),
    totalReturn: Joi.number().positive().optional().messages({
        'number.base': 'Total return must be a number',
        'number.positive': 'Total return must be positive'
    }),
    totalPayout: Joi.number().positive().optional().messages({
        'number.base': 'Total payout must be a number',
        'number.positive': 'Total payout must be positive'
    })
});

const updateInvestmentPlanSchema = createInvestmentPlanSchema;

module.exports = {
    createInvestmentPlanSchema,
    updateInvestmentPlanSchema
};
