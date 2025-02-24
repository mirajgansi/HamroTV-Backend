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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100],
        },
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'profilepicture' 
    }
}, {
    tableName: 'users',
});

User.beforeCreate(async (user) => {
    const bcrypt = require('bcrypt');
    user.password= await bcrypt.hash(user.password, 10);
});

module.exports = User;
