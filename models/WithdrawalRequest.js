const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const WithdrawalRequest = sequelize.define('WithdrawalRequest', {
  id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  bankAccount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  withdrawalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  statusHistory: {
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'withdrawal_requests',
});

module.exports = WithdrawalRequest;