const express = require('express');
const router = express.Router();

const { getHomeRoute, getTodos, postTodos, editTodos, deleteTodos } = require('../Controller/todoController');

router.get('/', getHomeRoute);

router.get('/tasks', getTodos);

router.post('/tasks', postTodos);

router.put('/tasks/:id', editTodos);

router.delete('/tasks/:id', deleteTodos);

module.exports = router;