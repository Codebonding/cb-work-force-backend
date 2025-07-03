const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { Op } = require('sequelize');
const UserStatus = require('../models/UserStatus');

const registerAdmin = async (userId) => {
  return await Admin.create({ userId });
};

const loginAdmin = async (userId) => {
  const admin = await Admin.findOne({ where: { userId } });
  if (!admin) throw new Error('Admin not found');

  const payload = {
    userId: admin.userId,
    adminId: admin.id
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

  return { token, admin };
};

const blockOrUnblockUser = async (userId, block, reason = null) => {
  if (!userId || typeof block !== 'boolean') {
    return {
      status: 400,
      body: {
        success: false,
        message: 'userId and block (true/false) are required'
      }
    };
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'User not found'
      }
    };
  }

  await UserStatus.upsert({ userId, isBlocked: block, reason });

  return {
    status: 200,
    body: {
      success: true,
      message: block
        ? 'User has been blocked successfully'
        : 'User has been unblocked successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isBlocked: block,
        reason: reason || null
      }
    }
  };
};

const logoutUser = async (userId) => {
  if (!userId) {
    return {
      status: 400,
      body: { success: false, message: 'userId is required' }
    };
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return {
      status: 404,
      body: { success: false, message: 'User not found' }
    };
  }

  await UserStatus.update(
    { isOnline: false, lastLogoutAt: new Date() },
    { where: { userId } }
  );

  return {
    status: 200,
    body: {
      success: true,
      message: 'User logged out successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  };
};

const getAllBlockStatuses = async (page = 1, limit = 10, search = '', block) => {
  const offset = (page - 1) * limit;

  // User search filters
  const userWhere = {};
  if (search) {
    userWhere[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }

  // Include UserStatus and filter if needed
  const statusWhere = {};
  if (typeof block === 'boolean') {
    statusWhere.isBlocked = block;
  }

  const { rows: users, count } = await User.findAndCountAll({
    where: userWhere,
    include: [
      {
        model: UserStatus,
        required: false, // LEFT JOIN
        attributes: ['isBlocked', 'reason'],
        where: typeof block === 'boolean' ? statusWhere : undefined
      }
    ],
    attributes: ['id', 'name', 'email', 'phone'],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  const formatted = users.map(user => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isBlocked: user.UserStatus?.isBlocked ?? false,
    reason: user.UserStatus?.reason ?? null
  }));

  return {
    status: 200,
    body: {
      success: true,
      message: 'Fetched block status for all users',
      users: formatted,
      pagination: {
        totalUsers: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    }
  };
};

module.exports = {
  registerAdmin,
  loginAdmin,
  blockOrUnblockUser,
  logoutUser,
  getAllBlockStatuses
};