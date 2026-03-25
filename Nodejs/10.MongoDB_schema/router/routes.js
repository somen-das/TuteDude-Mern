//D:\SOMEN\Self Practice\Nodejs\10.MongoDBConnect\router\routes.js
const express = require('express');

const router = express.Router();

const {getData,postData, editData, deleteData, multipleDeleteData} = require('../controller/controler')


router.get('/todo-mvc-data-get', getData);
router.post('/todo-mvc-data-post', postData);
router.put('/todo-mvc-data-edit', editData);
router.delete('/todo-mvc-data-delete', deleteData);
router.delete('/todo-mvc-data-delete-multiple', multipleDeleteData);

module.exports = router;