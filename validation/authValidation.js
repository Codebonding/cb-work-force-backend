const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least {#limit} characters long.',
            'string.max': 'Name cannot exceed {#limit} characters.'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format.',
            'string.empty': 'Email is required.'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least {#limit} characters long.'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm password must match the password.',
            'string.empty': 'Confirm password is required.'
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required.',
            'string.pattern.base': 'Phone number must be exactly 10 digits.'
        }),

    referralCode: Joi.string()
        .optional()
        .allow(null, '')
        .messages({
            'string.base': 'Referral code must be a string.'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format.',
            'string.empty': 'Email is required.'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required.'
        })
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ success: false, errors: error.details.map(err => err.message) });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ success: false, errors: error.details.map(err => err.message) });
    }
    next();
};

const validateUserId = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.string().uuid().required().messages({
            'string.guid': 'Invalid User ID format',
            'any.required': 'User ID is required'
        })
    });

    const { error } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({ success: false, errors: error.details });
    }

    next();
};

const validateForgotPassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Invalid email format.',
            'string.empty': 'Email is required.'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, errors: error.details.map(e => e.message) });
    }
    next();
};

const validateResetPassword = (req, res, next) => {
    const schema = Joi.object({
        token: Joi.string().required().messages({ 'string.empty': 'Token is required.' }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least {#limit} characters long.'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, errors: error.details.map(e => e.message) });
    }
    next();
};

module.exports = { validateRegister, validateLogin, validateUserId, validateForgotPassword, validateResetPassword };