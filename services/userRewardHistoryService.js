// services/userRewardHistory.service.js
const  UserRewardHistory  = require('../models/UserRewardHistory');

exports.getRewardHistoryByUserId = async (userId) => {
  return await UserRewardHistory.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};