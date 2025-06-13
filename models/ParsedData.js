const {DataTypes} = require('sequelize');
const db = require('../config/db')
const OriginalData = require('./OriginalData')
const ConfidenceScore = require('./ConfidenceScore')
const User = require('./User')
const UserData = require('./UserData')

const ParsedData = db.define('ParsedData',{
    Parsed_Updated_ID:{
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
    },
    User_ID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'User_ID'
        }
    },
    Parsed_Original_ID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:OriginalData,
            key:'Parsed_Original_ID'
        }
    },
    Score_ID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
           model:ConfidenceScore,
           key:'Score_ID' 
        }
    },
    User_Data_ID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
           model:UserData,
           key:'User_Data_ID' 
        }
    }
},{
    timestamps:true
})

ParsedData.belongsTo(User,{
    foreignKey:'User_ID',
    as:'User'
})
User.hasMany(ParsedData,{
    foreignKey:'User_ID',
    as:'ParseDatas'
})



ParsedData.belongsTo(ConfidenceScore,{
    foreignKey:'Score_ID',
    as:'ConfidenceScore'
})
ConfidenceScore.hasOne(ParsedData,{
    foreignKey:'Score_ID',
    as:'ParseData'
})

ParsedData.belongsTo(UserData,{
    foreignKey:'User_Data_ID',
    as:'UserData'
})
UserData.hasOne(ParsedData,{
    foreignKey:'User_Data_ID',
    as:'ParseData'
})



ParsedData.belongsTo(OriginalData,{
    foreignKey:'Parse_Original_ID',
    as:'OriginalData'
})
OriginalData.hasOne(ParsedData,{
    foreignKey:'Parse_Original_ID',
    as:'ParseData'
})
module.exports = ParsedData;