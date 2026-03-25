//D:\SOMEN\Self Practice\Nodejs\11.AdvancedGETAPI_SearchSortPagination\router\routes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {seedData, getData, postData, editData, deleteData, multipleDataDelete} = require('../controller/controler');
const {checkAdmin} = require('../middleware/adminGuard');

router.post('/seedData', seedData)
router.get('/get-advance-data', getData);
router.post('/post-advance-data', postData);
router.delete('/delete-advance-data',checkAdmin, deleteData);
router.put('/edit-advance-data', editData);
router.delete('/multipleDelete-advance-data', multipleDataDelete)


module.exports = router;
