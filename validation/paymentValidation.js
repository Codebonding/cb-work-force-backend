const Joi = require('joi');

const paymentSchema = Joi.object({
  amount: Joi.number()
    .required()
    .messages({
      'any.required': 'Payment amount is required.',
      'number.base': 'Amount must be a valid number.',
    }),
  utrNumber: Joi.string()
    .required()
    .messages({
      'any.required': 'UTR number is required.',
      'string.base': 'UTR number must be a string.',
    }),
  bankName: Joi.string()
    .required()
    .messages({
      'any.required': 'Bank name is required.',
      'string.base': 'Bank name must be a valid string.',
    }),
  accountNumber: Joi.string()
    .required()
    .messages({
      'any.required': 'Account number is required.',
      'string.base': 'Account number must be a valid string.',
    }),
  ifscCode: Joi.string()
    .required()
    .messages({
      'any.required': 'IFSC code is required.',
      'string.base': 'IFSC code must be a valid string.',
    }),
  paymentDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Payment date is required.',
      'date.base': 'Payment date must be a valid date.',
    }),
});

const validatePaymentPayload = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validatePaymentPayload };
