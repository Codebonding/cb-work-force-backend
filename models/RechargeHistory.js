const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const RechargeHistory = sequelize.define('RechargeHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  operatorCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  circleCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  txid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  opid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  referrerCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true
});
RechargeHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = RechargeHistory;