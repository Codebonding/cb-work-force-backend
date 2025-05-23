const Joi = require('joi');

const createWithdrawalSchema = Joi.object({
  bankAccount: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.base': 'Bank account must be a string',
      'string.empty': 'Bank account is required',
      'string.min': 'Bank account must be at least 6 characters',
      'string.max': 'Bank account must be at most 20 characters',
      'any.required': 'Bank account is required'
    }),
  ifscCode: Joi.string()
    .pattern(/^[A-Za-z]{4}[a-zA-Z0-9]{7}$/)
    .required()
    .messages({
      'string.pattern.base': 'IFSC code must be 4 letters followed by 7 alphanumeric characters',
      'string.empty': 'IFSC code is required',
      'any.required': 'IFSC code is required'
    }),
  branch: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Branch must be a string',
      'string.empty': 'Branch is required',
      'string.min': 'Branch must be at least 2 characters',
      'string.max': 'Branch must be at most 50 characters',
      'any.required': 'Branch is required'
    }),
  withdrawalAmount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Withdrawal amount must be a number',
      'number.positive': 'Withdrawal amount must be greater than zero',
      'any.required': 'Withdrawal amount is required'
    })
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'approved', 'rejected')
    .required()
    .messages({
      'any.only': 'Status must be one of pending, approved, or rejected',
      'string.empty': 'Status is required',
      'any.required': 'Status is required'
    })
});

module.exports = {
  createWithdrawalSchema,
  updateStatusSchema
};
