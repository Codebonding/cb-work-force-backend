const Joi = require('joi');

// Validation schema for sending investment payout
const validateInvestmentPayout = (req, res, next) => {
  const payoutSchema = Joi.object({
    userId: Joi.string().uuid().required().messages({
      'string.uuid': 'User ID must be a valid UUID.',
      'any.required': 'User ID is required.'
    }),
    investmentId: Joi.string().uuid().required().messages({
      'string.uuid': 'Investment ID must be a valid UUID.',
      'any.required': 'Investment ID is required.'
    })
  });

  const { error } = payoutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validation schema for updating investment status
const validateInvestmentStatusUpdate = (req, res, next) => {
  const statusUpdateSchema = Joi.object({
    investmentId: Joi.string().uuid().required().messages({
      'string.uuid': 'Investment ID must be a valid UUID.',
      'any.required': 'Investment ID is required.'
    }),
    status: Joi.string().valid('active', 'completed').required().messages({
      'any.only': 'Status must be either "active" or "completed".',
      'any.required': 'Status is required.'
    })
  });

  const { error } = statusUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateInvestmentPayout,
  validateInvestmentStatusUpdate
};