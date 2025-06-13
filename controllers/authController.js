const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require("path")
const jwt = require('jsonwebtoken');

const register = async (req, res) =>{
    res.sendFile(path.join(__dirname,"..","public","register.html"));

}
const login = async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
}
const registerUser = async (req ,res)=>{
    console.log(req.body)
    const {username,password,confirm_password} = req.body;
    if(!username || !password || !confirm_password){
        return res.status(200).json({message: "Please fill all fields"});
    }
    if(password !== confirm_password){
        return res.status(200).json({message: "Passwords do not match"});
    }
    try{
        const existingUser = await User.findOne({where:{Username:username}});
        if(existingUser){
            return res.status(200).json({message: "Username already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            Username:username,
            Password: hashedPassword
        });
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '48h' }
        );
        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username
            },
            success:true,
            token
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

const loginUser = async (req, res) => {
    console.log("Login request received");
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    console.log("Login request received:", req.body);
    try {
        const user = await User.findOne({ where: { Username:username } });
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(200).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user.User_ID, username: user.Username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '48h' }
        );
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    register,
    login,
};