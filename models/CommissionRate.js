const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommissionRate = sequelize.define('CommissionRate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    operatorCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userCommission: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    referrerCommission: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: true
  });
  
  module.exports = CommissionRate;