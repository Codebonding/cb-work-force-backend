const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Admin = require('./Admin');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  utrNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Admin,
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Admin,
      key: 'id'
    }
  }
}, { timestamps: true });

// Associations
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'createdBy' });
Payment.belongsTo(User, { foreignKey: 'createdBy' });

Admin.hasMany(Payment, { foreignKey: 'adminId' });
Payment.belongsTo(Admin, { foreignKey: 'adminId' });

Admin.hasMany(Payment, { foreignKey: 'updatedBy' });
Payment.belongsTo(Admin, { foreignKey: 'updatedBy' });

module.exports = Payment;