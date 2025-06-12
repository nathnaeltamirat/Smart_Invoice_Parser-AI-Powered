const {DataTypes} = require('sequelize');
const db = require('../config/db');


const User = db.define("User",{
    User_ID: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    Username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Password:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = User;