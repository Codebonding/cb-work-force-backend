const User = require('../models/User');
const { fn, col } = require('sequelize');

const getVerificationStatusCount = async () => {
  const results = await User.findAll({
    attributes: ['verify', [fn('COUNT', col('verify')), 'count']],
    group: ['verify']
  });

  const summary = {
    active: 0,
    inactive: 0,
    total: 0
  };

  results.forEach(row => {
    const isVerified = row.getDataValue('verify');
    const count = parseInt(row.getDataValue('count'), 10);

    if (isVerified) {
      summary.active = count;
    } else {
      summary.inactive = count;
    }

    summary.total += count;
  });

  return summary;
};

module.exports = {
  getVerificationStatusCount
};
