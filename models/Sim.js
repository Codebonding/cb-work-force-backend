const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sim = sequelize.define('Sim', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  operatorCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  circleCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Sim;