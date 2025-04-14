const UserFinancial = require('../models/UserFinancial');

const getByUserId = async (userId) => {
    return await UserFinancial.findOne({ where: { userId } });
};

module.exports = {
    getByUserId
};