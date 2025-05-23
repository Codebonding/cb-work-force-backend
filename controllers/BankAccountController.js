const bankAccountService = require('../services/BankAccountService');

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    const account = await bankAccountService.createBankAccount(userId, data);
    res.status(201).json({ success: true, message: 'Bank account created', data: account });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountId = req.params.id;
    const data = req.body;

    const updated = await bankAccountService.updateBankAccount(userId, accountId, data);
    res.status(200).json({ success: true, message: 'Bank account updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountId = req.params.id;

    await bankAccountService.deleteBankAccount(userId, accountId);
    res.status(200).json({ success: true, message: 'Bank account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accounts = await bankAccountService.getUserBankAccounts(userId);
    res.status(200).json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  create,
  update,
  remove,
  getAll
};