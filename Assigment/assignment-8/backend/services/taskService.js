const Task = require('../models/Task');

class TaskService {
  async getAllTasks(searchQuery = '') {
    const query = searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {};
    return await Task.find(query).sort({ createdAt: -1 });
  }

  async createTask(taskData) {
    const task = new Task(taskData);
    return await task.save();
  }

  async updateTask(taskId, updateData) {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });
  }

  async deleteTask(taskId) {
    return await Task.findByIdAndDelete(taskId);
  }
}

module.exports = new TaskService();
