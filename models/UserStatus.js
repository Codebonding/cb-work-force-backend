const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const UserStatus = sequelize.define('UserStatus', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogoutAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

UserStatus.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(UserStatus, { foreignKey: 'userId' });

module.exports = UserStatus;