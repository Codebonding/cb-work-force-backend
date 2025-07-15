const WithdrawalRequest = require('../models/WithdrawalRequest');
const UserFinancial = require('../models/UserFinancial');
const User = require('../models/User');
const { Op } = require('sequelize');

const createWithdrawalRequest = async ({ userId, bankAccount, ifscCode, branch, withdrawalAmount }) => {
  // Check balance
  const userFin = await UserFinancial.findOne({ where: { userId } });
  if (!userFin) throw new Error('User financial data not found');

  if (userFin.accountBalance < withdrawalAmount) {
    throw new Error('Insufficient balance');
  }

  // Create withdrawal request (status: pending)
  const request = await WithdrawalRequest.create({
    userId,
    bankAccount,
    ifscCode,
    branch,
    withdrawalAmount,
    status: 'pending',
    statusHistory: [],
  });

  return request;
};


const getAllWithdrawalRequests = async (userId, offset, limit) => {
  return await WithdrawalRequest.findAndCountAll({
    where: { userId },
    offset,
    limit,
    order: [['createdAt', 'DESC']]
  });
};


const getAllAdminWithdrawalRequests = async (offset, limit, filters = {}) => {
  if (!WithdrawalRequest.associations.user) {
    WithdrawalRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }

  const whereClause = {};

  // Filter by status
  if (filters.status) {
    whereClause.status = filters.status;
  }

  // Combined search on both withdrawal + user fields
  if (filters.search) {
    const keyword = `%${filters.search}%`;

    whereClause[Op.or] = [
      { bankAccount: { [Op.like]: keyword } },
      { ifscCode: { [Op.like]: keyword } },
      { branch: { [Op.like]: keyword } },
      { '$user.name$': { [Op.like]: keyword } },
      { '$user.email$': { [Op.like]: keyword } },
      { '$user.phone$': { [Op.like]: keyword } }
    ];
  }

  return await WithdrawalRequest.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone'],
        required: false // always include user
      }
    ]
  });
};




const getWithdrawalRequestById = async (id) => {
  return await WithdrawalRequest.findByPk(id);
};

const updateWithdrawalStatus = async (id, status, adminId) => {
  

  const request = await WithdrawalRequest.findByPk(id);

  if (!request) throw new Error('Withdrawal request not found');

  console.log("Request found, userId:", request.userId);

  if (request.status === status) {
    throw new Error(`Status is already '${status}'`);
  }

  if (request.status !== 'pending') {
    throw new Error('Only pending requests can be updated');
  }

  if (status === 'approved') {
    const userFin = await UserFinancial.findOne({ where: { userId: request.userId } });
    if (!userFin) throw new Error('User financial data not found');

    if (userFin.accountBalance < request.withdrawalAmount) {
      throw new Error('Insufficient balance for approval');
    }

    userFin.accountBalance -= request.withdrawalAmount;
    await userFin.save();
  }

  const newHistoryEntry = {
    oldStatus: request.status,
    newStatus: status,
    changedAt: new Date().toISOString(),
    changedByAdminId: adminId,
  };

  request.status = status;
  request.statusHistory = [...request.statusHistory, newHistoryEntry];
  await request.save();

  return request;
};


module.exports = {
  createWithdrawalRequest,
  getAllWithdrawalRequests,
  getWithdrawalRequestById,
  updateWithdrawalStatus,
  getAllAdminWithdrawalRequests
};