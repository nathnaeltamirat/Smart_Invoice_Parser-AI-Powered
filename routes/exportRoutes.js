const express = require('express');
const verify = require('../middlewares/auth');
const router = express.Router();
const {singleExport,multiExport} = require('../controllers/exportController');

router.get("/single",verify,singleExport);
router.get("/multiExport",verify,multiExport)



module.exports = router