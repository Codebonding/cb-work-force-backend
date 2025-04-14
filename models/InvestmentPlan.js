const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvestmentPlan = sequelize.define('InvestmentPlan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    planName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    investmentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    durationValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    durationUnit: {
        type: DataTypes.ENUM('second', 'minute', 'hour', 'day', 'month', 'year'),
        allowNull: false
    },
    payoutCycleValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payoutCycleUnit: {
        type: DataTypes.ENUM('second', 'minute', 'hour', 'day', 'month', 'year'),
        allowNull: false
    },
    profit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payoutPerCycle: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalReturn: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalPayout: {
        type: DataTypes.FLOAT,
        allowNull: false
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

module.exports = InvestmentPlan;