const Payment = require('../models/Payment');
const UserFinancial = require('../models/UserFinancial');
const User = require('../models/User');
const { Op } = require('sequelize');

const createPayment = async ({ userId, utrNumber, amount, bankName, accountNumber, ifscCode, paymentDate }) => {
  // Optional check for duplicate UTR number
  const existing = await Payment.findOne({ where: { utrNumber } });
  if (existing) {
    throw new Error('UTR number already exists.');
  }

  const payment = await Payment.create({
    userId,
    utrNumber,
    amount,
    bankName,
    accountNumber,
    ifscCode,
    paymentDate,
    status: 'pending'
  });

  return payment;
};


const getUserPayments = async (userId) => {
  try {
    // Step 1: Fetch payments
    const payments = await Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    // Step 2: Update totalTransaction count in UserFinancial
    const totalPayments = payments.length;

    const userFinancial = await UserFinancial.findOne({ where: { userId } });

    if (userFinancial) {
      userFinancial.totalTransaction = totalPayments;
      userFinancial.lastUpdated = new Date();
      await userFinancial.save();
    }

    // Step 3: Return result
    if (totalPayments === 0) {
      return { message: 'No payments found for this user.' };
    }

    return {
      message: 'Payments fetched and transaction count updated successfully!',
      totalTransaction: totalPayments,
      payments
    };

  } catch (error) {
    throw new Error(`Error fetching user payments: ${error.message}`);
  }
};


const getAllPayments = async ({ limit, offset, search }) => {
  try {
    const searchFilter = search
      ? {
          [Op.or]: [
            { utrNumber: { [Op.like]: `%${search}%` } },
            { '$UserFinancial.User.name$': { [Op.like]: `%${search}%` } },
            { '$UserFinancial.User.email$': { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { rows: payments, count: totalCount } = await Payment.findAndCountAll({
      where: searchFilter,
      include: [
        {
          model: UserFinancial,
          attributes: ['accountBalance'],
          include: {
            model: User,
            attributes: ['name', 'email']
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return { payments, totalCount };
  } catch (error) {
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

const updatePaymentStatus = async (paymentId, status, adminId, rejectionReason = null) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return { message: 'Payment not found.' };
    }

    // Prevent duplicate approval
    if (payment.status === 'completed' && status === 'completed') {
      return { message: 'Payment is already approved.' };
    }

    // Update payment record
    await payment.update({
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      approvedBy: adminId,
      updatedBy: adminId
    });

    // Only update balance when status is 'completed'
    if (status === 'completed') {
      const userId = payment.userId;
      const amount = parseFloat(payment.amount);

      let userFinancial = await UserFinancial.findOne({ where: { userId } });

      if (!userFinancial) {
        userFinancial = await UserFinancial.create({ userId });
      }

      userFinancial.accountBalance += amount;
      userFinancial.lastUpdated = new Date();

      await userFinancial.save();
    }

    return {
      message: `Payment status updated to '${status}' successfully.`,
      payment
    };
  } catch (error) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
};
const getPaymentStatusByUTR = async (utrNumber) => {
  try {
    const payment = await Payment.findOne({
      where: { utrNumber }
    });
    if (!payment) {
      return { message: 'Payment not found with the provided UTR number.' };
    }
    return { message: 'Payment status fetched successfully!', payment };
  } catch (error) {
    throw new Error(`Error fetching payment status by UTR: ${error.message}`);
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getAllPayments,
  updatePaymentStatus,
  getPaymentStatusByUTR
};
