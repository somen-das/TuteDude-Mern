// D:\SOMEN\Self Practice\Nodejs\9.MVC_Structure_backend\Routes\todoRoutes.js
const express = require('express');

const router = express.Router();

const {getHomeRoute, getTodos, postTodos, editTodos, deleteTodos, multipleDelete} = require('../Controller/todoController');

router.get('/', getHomeRoute);
router.get('/todo-mvc-data-get', getTodos);
router.post('/todo-mvc-data-post', postTodos);
router.put('/todo-mvc-data-edit', editTodos);
router.delete('/todo-mvc-data-delete', deleteTodos);
router.delete('/todo-mvc-data-delete-multiple', multipleDelete);

module.exports = router;