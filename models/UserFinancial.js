// models/UserFinancial.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const UserFinancial = sequelize.define('UserFinancial', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        unique: true
    },
    accountBalance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalCommission: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalRechargePaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalInvestment: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalTransaction: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalReferral: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

User.hasOne(UserFinancial, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserFinancial.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserFinancial;