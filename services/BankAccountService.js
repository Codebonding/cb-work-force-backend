const BankAccount = require('../models/BankAccount');
const { Op } = require('sequelize'); // Make sure you import Op

const createBankAccount = async (userId, data) => {
  if (!data.accountNumber) {
    throw new Error('Account number is required');
  }

  const existing = await BankAccount.findOne({
    where: {
      userId,
      accountNumber: data.accountNumber
    }
  });

  if (existing) {
    throw new Error('Bank account with this account number already exists');
  }

  return await BankAccount.create({ ...data, userId });
};

const updateBankAccount = async (userId, accountId, data) => {
  const account = await BankAccount.findOne({ where: { id: accountId, userId } });
  if (!account) throw new Error('Bank account not found');

  if (data.accountNumber && data.accountNumber !== account.accountNumber) {
    const existing = await BankAccount.findOne({
      where: {
        userId,
        accountNumber: data.accountNumber,
        id: { [Op.ne]: accountId }
      }
    });

    if (existing) {
      throw new Error('Another bank account with this account number already exists');
    }
  }

  return await account.update(data);
};


const deleteBankAccount = async (userId, accountId) => {
  const deleted = await BankAccount.destroy({ where: { id: accountId, userId } });
  if (!deleted) throw new Error('Bank account not found or not authorized');
  return true;
};

const getUserBankAccounts = async (userId) => {
  console.log(userId);
  return await BankAccount.findAll({ where: { userId } });
};

module.exports = {
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getUserBankAccounts
};