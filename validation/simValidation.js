const Joi = require('joi');

const simSchema = Joi.object({
    name: Joi.string().min(2).required()
        .messages({
            'string.base': 'Provider must be a string',
            'string.empty': 'Provider is required',
            'string.min': 'Provider must be at least 2 characters long',
            'any.required': 'Provider is required'
        }),
        circleCode: Joi.number().integer().required()
        .messages({
          'number.base': 'Circle code must be a number',
          'number.integer': 'Circle code must be an integer',
          'any.required': 'Circle code is required'
        }),
    operatorCode: Joi.string().alphanum().required()
        .messages({
            'string.base': 'Operator Code must be a string',
            'string.empty': 'Operator Code is required',
            'any.required': 'Operator Code is required'
        }),
});

// Middleware
const validateSim = (req, res, next) => {
    const { error } = simSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            errors: error.details.map(err => err.message)
        });
    }

    next();
};

module.exports = { validateSim };
