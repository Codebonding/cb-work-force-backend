const Joi = require('joi');

// Joi Schema for admin-related validation
const adminSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

// Validation middleware
const validateAdminPayload = (req, res, next) => {
  const { error } = adminSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = {
  adminSchema,
  validateAdminPayload,
};