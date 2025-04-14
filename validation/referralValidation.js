const Joi = require('joi');

const referralListSchema = Joi.object({
    page: Joi.number().integer().min(1).optional()
        .messages({ 'number.base': 'Page must be a number', 'number.min': 'Page must be at least 1' }),

    limit: Joi.number().integer().min(1).optional()
        .messages({ 'number.base': 'Limit must be a number', 'number.min': 'Limit must be at least 1' }),

    search: Joi.string().optional()
        .messages({ 'string.base': 'Search must be a string' }),

    phone: Joi.string().optional()
        .messages({ 'string.base': 'Phone must be a string' }),

    status: Joi.string().valid('verified', 'unverified').optional()
        .messages({ 'any.only': 'Status must be "verified" or "pending"' }),
});

// Middleware for validation
const validateReferralList = (req, res, next) => {
    const { error } = referralListSchema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details.map(err => err.message) });
    }

    next();
};

module.exports = { validateReferralList };
