const {DataTypes} = require('sequelize');
const db = require('../config/db')

const ConfidenceScore = db.define('ConfidenceScore',{
    Score_ID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    Vendor:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    Invoiced_Number:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    Invoice_Date:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    Total_Amount:{
        type:DataTypes.FLOAT,
        allowNull:true
    }
}
)

module.exports = ConfidenceScore;