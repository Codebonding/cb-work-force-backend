// validation/kycValidation.js
const Joi = require('joi');

const kycSchema = Joi.object({
    aadharNumber: Joi.string()
        .length(12)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'string.length': 'Aadhar number must be exactly 12 digits.',
            'string.pattern.base': 'Aadhar number must contain only digits.',
            'any.required': 'Aadhar number is required.'
        }),

    panNumber: Joi.string()
        .length(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
        .required()
        .messages({
            'string.length': 'PAN number must be exactly 10 characters.',
            'string.pattern.base': 'PAN number format is invalid.',
            'any.required': 'PAN number is required.'
        }),

    address: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.min': 'Address must be at least 5 characters long.',
            'any.required': 'Address is required.'
        })
});

const otpSchema = Joi.object({
    otp: Joi.string()
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 6 digits.',
            'string.pattern.base': 'OTP must contain only digits.',
            'any.required': 'OTP is required.'
        })
});

const validateKYC = (req, res, next) => {
    const { error } = kycSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(err => err.message) });
    }
    next();
};

const validateOTP = (req, res, next) => {
    const { error } = otpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(err => err.message) });
    }
    next();
};

module.exports = { validateKYC, validateOTP };
