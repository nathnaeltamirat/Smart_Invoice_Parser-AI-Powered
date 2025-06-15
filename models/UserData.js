
const {DataTypes} = require('sequelize');
const db = require('../config/db');


const UserData = db.define('UserData',{
    User_Data_ID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    link:{
        type:DataTypes.STRING,
        allowNull:true
    },
}
)

module.exports = UserData;
