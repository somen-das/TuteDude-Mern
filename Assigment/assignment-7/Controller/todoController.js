const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '../Data/new-todo-data.json');

// get todo datas
const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// get todo datas
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// my home Route
const getHomeRoute = (req, res) => {
    res.send('Welcome to my todo api');
};

// get tasks
const getTodos = (req, res) => {
    const data = readData();
    res.status(200).json(data);
};

// post task create
const postTodos = (req, res) => {
    const { title, completed = false } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const data = readData();

    const newTask = {
        id: uuidv4(),
        title,
        completed
    };

    data.push(newTask);
    writeData(data);

    res.status(201).json({
        message: 'Task created successfully!',
        task: newTask
    });
};

// update task put
const editTodos = (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const data = readData();
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) data[index].title = title;
    if (completed !== undefined) data[index].completed = completed;

    writeData(data);

    res.status(200).json({
        message: 'Task updated successfully',
        task: data[index]
    });
};

// delete task
const deleteTodos = (req, res) => {
    const { id } = req.params;

    const data = readData();
    const newData = data.filter(item => item.id !== id);

    if (data.length === newData.length) {
        return res.status(404).json({ message: 'Task not found' });
    }

    writeData(newData);

    res.status(200).json({
        message: 'Task deleted successfully',
        total: newData.length
    });
};

module.exports = {
    getHomeRoute,
    getTodos,
    postTodos,
    editTodos,
    deleteTodos
};