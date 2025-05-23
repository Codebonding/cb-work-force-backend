const WithdrawalRequest = require('../models/WithdrawalRequest');
const UserFinancial = require('../models/UserFinancial');

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


const getAllWithdrawalRequests = async () => {
  return await WithdrawalRequest.findAll();
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
};