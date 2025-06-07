const UserRewardHistory = require('../models/UserRewardHistory');

exports.getRewardHistoryByUserId = async (userId, limit, offset) => {
  return await UserRewardHistory.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};