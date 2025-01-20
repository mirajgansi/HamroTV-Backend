const {DataType, DataTypes, Model} = require('sequelize');
const sequelize = require('../database/db');

const Test= sequelize.define('Test',{
    id: {type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,}
        ,name:{
            type:DataTypes.STRING(255),
            allowNull:false,},
            email:{
                type:  DataTypes.STRING,
                allowNull:false,
                unique:true,
        },
});
module.exports=Test;