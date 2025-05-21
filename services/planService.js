const Plan = require('../models/Plan');
exports.createPlan = async (data) => await Plan.create(data);
exports.getPlansBySim = async (simId) => await Plan.findAll({ where: { simId } });
const { Op, literal } = require('sequelize');

exports.getPlansByType = async (type, priceSubstring) => {
    let whereClause;

    if (priceSubstring !== undefined) {
        // Ignore planType, search all plans where price contains priceSubstring
        whereClause = literal(`CAST(price AS CHAR) LIKE '%${priceSubstring}%'`);
    } else {
        // Filter by planType only
        whereClause = { planType: type };
    }

    return await Plan.findAll({ where: whereClause });
};
