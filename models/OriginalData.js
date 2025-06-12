const {DataTypes} = require('sequelize');
const db = require('../config/db')

const OriginalData = db.define('OriginalData',{
    Parsed_Original_ID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    Vendor:{
        type:DataTypes.STRING,
        allowNull:true
    },
    Invoiced_Number:{
        type:DataTypes.STRING,
        allowNull:true
    },
    Invoice_Date:{
        type:DataTypes.DATE,
        allowNull:true
    },
    Total_Amount:{
        type:DataTypes.DOUBLE,
        allowNull:true
    }
}
)

module.exports = OriginalData;