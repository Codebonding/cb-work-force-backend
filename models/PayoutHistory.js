const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const UserInvestment = require('./UserInvestment');

const PayoutHistory = sequelize.define('PayoutHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  investmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'UserInvestments',
      key: 'id'
    }
  },
  payoutAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payoutDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
PayoutHistory.belongsTo(User, { foreignKey: 'userId' });
PayoutHistory.belongsTo(UserInvestment, { foreignKey: 'investmentId' });

module.exports = PayoutHistory;