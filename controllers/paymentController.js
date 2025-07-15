const Authorized = require('../models/Authorized');
const paymentService = require('../services/paymentService');

const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { utrNumber, amount, bankName, accountNumber, ifscCode, paymentDate } = req.body;

    // Check if user has completed KYC and is verified
    const authorizedUser = await Authorized.findOne({ where: { userId } });

    if (!authorizedUser) {
      return res.status(403).json({ message: 'KYC not submitted. Please complete your KYC process.' });
    }

    if (!authorizedUser.verified) {
      return res.status(403).json({ message: 'KYC not verified. Please wait for admin approval.' });
    }

    // Call service to create payment
    const payment = await paymentService.createPayment({
      userId,
      utrNumber,
      amount,
      bankName,
      accountNumber,
      ifscCode,
      paymentDate
    });

    return res.status(201).json({ message: 'Payment created successfully.', data: payment });

  } catch (error) {
    console.error('Create Payment Error:', error);
    return res.status(500).json({ message: 'Server error while creating payment', error: error.message });
  }
};
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const payments = await paymentService.getUserPayments(userId);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user.' });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payments',
      error: error.message || 'Unknown error occurred. Please try again later.'
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const { payments, totalCount } = await paymentService.getAllPayments({ limit, offset, search });

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found.' });
    }

    // Format results (flatten user info)
    const formatted = payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      amount: p.amount,
      utrNumber: p.utrNumber,
      bankName: p.bankName,
      accountNumber: p.accountNumber,
      ifscCode: p.ifscCode,
      paymentDate: p.paymentDate,
      status: p.status,
      rejectionReason: p.rejectionReason,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      name: p.UserFinancial?.User?.name || '',
      email: p.UserFinancial?.User?.email || '',
      accountBalance: p.UserFinancial?.accountBalance || 0
    }));

    res.json({
      message: 'Payments fetched successfully!',
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecords: totalCount,
      payments: formatted
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payments',
      error: error.message || 'Unknown error occurred.'
    });
  }
};


const approvePayment = async (req, res) => {
  const { adminId } = req.body;  // Get adminId from request body

  if (!adminId) {
    return res.status(400).json({ message: 'Admin ID is required in the body' });
  }

  try {
    await paymentService.updatePaymentStatus(req.params.id, 'completed', adminId);
    res.json({ message: 'Payment approved successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error approving payment',
      error: error.message || 'Unknown error occurred while approving the payment.'
    });
  }
};

const rejectPayment = async (req, res) => {
  const { adminId, rejectionReason } = req.body;

  if (!adminId || !rejectionReason) {
    return res.status(400).json({ message: 'Admin ID and rejection reason are required in the body' });
  }

  try {
    await paymentService.updatePaymentStatus(req.params.id, 'rejected', adminId, rejectionReason);
    res.json({ message: 'Payment rejected successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting payment',
      error: error.message || 'Unknown error occurred while rejecting the payment.'
    });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { utrNumber } = req.body;
    if (!utrNumber) {
      return res.status(400).json({ message: 'UTR number is required' });
    }

    const payment = await paymentService.getPaymentStatusByUTR(utrNumber);

    if (!payment) {
      return res.status(404).json({ message: 'No payment found with the provided UTR number' });
    }

    res.json({
      paymentId: payment.id,
      utrNumber: payment.utrNumber,
      status: payment.status,
      amount: payment.amount,
      date: payment.createdAt
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payment status',
      error: error.message || 'Unknown error occurred while fetching payment status.'
    });
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getAllPayments,
  approvePayment,
  rejectPayment,
  getPaymentStatus
};
