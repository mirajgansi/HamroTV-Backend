const { DataTypes } = require('sequelize');
const {sequelize} = require('../database/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
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
        allowNull: false,
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
    tableName: 'users',
});

User.beforeCreate(async (user) => {
    const bcrypt = require('bcrypt');
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

module.exports = User;
