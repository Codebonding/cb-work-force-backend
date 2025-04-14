// 📁 validation/userInvestmentValidation.js
const Joi = require('joi');

const purchaseSchema = Joi.object({
    investmentPlanId: Joi.string().uuid().required(),
});

exports.validatePurchaseInvestment = (req, res, next) => {
    const { error } = purchaseSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};
