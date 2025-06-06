const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DthPlan = sequelize.define('DthPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  dthId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Dths',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validity: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = DthPlan;