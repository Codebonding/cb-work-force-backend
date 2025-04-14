const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Sim = require('./Sim');

const Plan = sequelize.define('Plan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    simId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    planType: {
        type: DataTypes.ENUM('recommended', 'special', 'topup', 'data'),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    validity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dataLimit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

Plan.belongsTo(Sim, { foreignKey: 'simId', as: 'sim' });

module.exports = Plan;