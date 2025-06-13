const express = require('express');

const router = express.Router();
const {loadHistory,serveHistory}  = require('../controllers/historyController');

router.get('', serveHistory);
router.get('/loadHistory', loadHistory);


module.exports = router;