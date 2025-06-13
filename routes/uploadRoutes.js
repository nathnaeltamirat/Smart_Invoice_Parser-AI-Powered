require('dotenv').config();
const express = require('express');    
const {loader,uploader} = require('../controllers/uploadController');
const gemniProcess = require('../controllers/gemniController')
const {editItem,getItem,updateItem,restoreItem,deleteItem} = require('../controllers/editController');
const verifyToken = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } 
});


router.get('/load', loader);
router.post('/load',upload.single('file'),uploader);
router.post('/gemni',gemniProcess);
router.get('/update', editItem);
router.get('/get', getItem);
router.post('/change', updateItem);
router.get('/restore', restoreItem);
router.delete('/delete', deleteItem);
module.exports = router;