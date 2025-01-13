const {Datatypes} = require('sequelize');
const sequelize = require('../database/db');

const Test= sequelize.define('Test',{
    id: {type:Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,}
    ,username:{
            type:Datatypes.STRING,
            allowNull:false,},
    password:{
                type:  Datatypes.STRING,
                allowNull:false,
                unique:true,
        },
});
module.exports=Test;