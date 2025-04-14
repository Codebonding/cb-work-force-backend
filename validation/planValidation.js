const Joi = require('joi');

const planSchema = Joi.object({
    simId: Joi.string().guid({ version: 'uuidv4' }).required()
        .messages({
            'any.required': 'simId is required',
            'string.guid': 'Invalid simId format'
        }),
    planType: Joi.string().valid('recommended', 'special', 'topup', 'data').required()
        .messages({
            'any.only': 'planType must be one of recommended, special, topup, or data',
            'any.required': 'planType is required'
        }),
    price: Joi.number().positive().required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be positive',
            'any.required': 'Price is required'
        }),
    validity: Joi.string().optional()
        .messages({
            'string.base': 'Validity must be a string'
        }),
    dataLimit: Joi.string().optional()
        .messages({
            'string.base': 'Data limit must be a string'
        }),
    description: Joi.string().allow('').optional()
});

// Middleware
const validatePlan = (req, res, next) => {
    const { error } = planSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            errors: error.details.map(err => err.message)
        });
    }

    next();
};

module.exports = { validatePlan };
