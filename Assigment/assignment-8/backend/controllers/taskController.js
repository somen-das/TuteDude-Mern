const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res) {
    try {
      const { search } = req.query;
      const tasks = await taskService.getAllTasks(search);
      res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }

  async createTask(req, res) {
    try {
      if (!req.body.title) {
        return res.status(400).json({ success: false, error: 'Please add a title' });
      }
      const task = await taskService.createTask(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({ success: false, error: messages });
      }
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }

  async updateTaskStatus(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, { completed: req.body.completed });
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }

  async deleteTask(req, res) {
    try {
      const task = await taskService.deleteTask(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
}

module.exports = new TaskController();
