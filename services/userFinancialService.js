const UserFinancial = require('../models/UserFinancial');
const User = require('../models/User'); // import your User model

const getByUserId = async (userId) => {
    const financialData = await UserFinancial.findOne({ where: { userId } });

    if (!financialData) return null;

    const referralCount = await User.count({ where: { referredBy: userId } });

    console.log(referralCount,"dfdf")

    return {
        ...financialData.toJSON(),
        referralCount,
    };
};

module.exports = {
    getByUserId
};
