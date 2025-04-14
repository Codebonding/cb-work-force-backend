const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const InvestmentPlan = require('./InvestmentPlan');

const UserInvestment = sequelize.define('UserInvestment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  investmentPlanId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  investedAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  expectedReturn: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true
});

UserInvestment.belongsTo(User, { foreignKey: 'userId' });
UserInvestment.belongsTo(InvestmentPlan, { foreignKey: 'investmentPlanId' });

module.exports = UserInvestment;