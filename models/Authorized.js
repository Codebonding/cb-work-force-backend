const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Authorized = sequelize.define('Authorized', {
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
        onDelete: 'CASCADE'
    },
    aadharNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [12, 12] // Ensures exactly 12 digits
        }
    },
    panNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ // Validates PAN format
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [10, 255] // Ensures address length is reasonable
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

User.hasOne(Authorized, { foreignKey: 'userId', as: 'authorized' });
Authorized.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Authorized;