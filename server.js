require('dotenv').config();
const express = require('express')
const db = require('./config/db');
const User = require('./models/User');
const ParsedData = require('./models/ParsedData');
const OriginalData = require('./models/OriginalData')
const ConfidenceScore = require('./models/ConfidenceScore');
const auth = require('./routes/authRoutes');
const uploading = require('./routes/uploadRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT|| 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use('/api/auth',auth);
app.use('/api/upload',uploading);
app.use(cors());
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max size is 5MB.' });
    }
    next(err);
});
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

