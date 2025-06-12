const express = require('express')
const db = require('./config/db');
const User = require('./models/User');
const ParsedData = require('./models/ParsedData');
const OriginalData = require('./models/OriginalData')


const app = express();
const PORT = process.env.PORT;


(
    async()=>{
        try{
            await db.sync();
            console.log("Database synced");

            app.listen(PORT, ()=>{
                console.log(`Server is Running on Port ${PORT}`)
            })
        }catch(err){
            console.log("Failed to sync Database ",err);
        }
    }
)();

