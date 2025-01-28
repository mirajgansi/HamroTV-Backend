    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = require('../database/db');

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true, 
            validate: {
                isEmail: true, 
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true, 
            validate: {
                len: [3, 50], 
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                len: [8, 100], 
            },
        },
    }, {
        timestamps: false, 
        tableName: 'users', 
    });

    module.exports = User;