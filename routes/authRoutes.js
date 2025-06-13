const express = require('express');
const router = express.Router();
const {registerUser, loginUser,register,login} = require('../controllers/authController');

router.get("/register", register);
router.get("/login", login);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;