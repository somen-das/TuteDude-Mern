import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } from './services/api';
import { Plus, Trash2, Edit2, Search, CheckCircle2, ListTodo, Loader2 } from 'lucide-react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks(searchQuery);
      setTasks(data.data);
    } catch (err) {
      setError('Failed to connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (isEditing) {
        await updateTask(currentTaskId, { title });
        setIsEditing(false);
        setCurrentTaskId(null);
      } else {
        await createTask({ title, completed: false });
      }
      setTitle('');
      fetchTasks();
    } catch (err) {
      setError('Failed to save task.');
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setTitle(task.title);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !currentStatus } : t));
      
      await updateTaskStatus(id, !currentStatus);
    } catch (err) {
      setError('Failed to update task status.');
      fetchTasks(); 
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">
        <ListTodo size={36} color="#4ade80" />
        My To-Do Tasks
      </h1>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search your tasks..." 
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <input 
          type="text" 
          className="task-input" 
          placeholder="What needs to be done?" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn-add">
          {isEditing ? <CheckCircle2 size={20} /> : <Plus size={20} />}
          {isEditing ? 'Update' : 'Add'}
        </button>
      </form>

      {loading ? (
        <div className="loading-spinner">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={48} style={{ margin: '0 auto', opacity: 0.5, marginBottom: '16px' }} />
          <h3>No tasks found</h3>
          <p>Get started by adding a new task above!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => handleToggleStatus(task._id, task.completed)}
                />
                <span className="checkmark"></span>
              </label>

              <span className="task-content">
                {task.title}
              </span>

              <div className="task-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => handleEdit(task)}
                  title="Edit task"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="btn-icon btn-delete" 
                  onClick={() => handleDelete(task._id)}
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
