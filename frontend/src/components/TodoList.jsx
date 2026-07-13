import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const API_URL = 'http://localhost:5000/api/todos';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
    }
  };

  const addTodo = (newTodo) => {
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(t => t._id === updatedTodo._id ? updatedTodo : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t._id !== id));
  };

  const deleteAll = async () => {
    if (todos.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${todos.length} tasks? This cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await axios.delete(API_URL);
      setTodos([]);
    } catch (error) {
      console.error('Error deleting all todos:', error);
    }
  };

  // Stats
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your tasks...</p>
    </div>
  );

  return (
    <div className="app-wrapper">
      <div className="glass-card">
        {/* Header */}
        <div className="header">
          <h1>Task Master</h1>
          <p className="subtitle">Progress over perfection</p>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="progress-container">
            <div className="progress-info">
              <span>{completedCount} of {totalCount} completed</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Form */}
        <TodoForm onTodoAdded={addTodo} />

        {/* Todo List */}
        <div className="todos-container">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>All caught up!</h3>
              <p>Add your first task above to get started</p>
            </div>
          ) : (
            <div className="todos-list">
              {todos.map((todo, index) => (
                <TodoItem 
                  key={todo._id} 
                  todo={todo} 
                  index={index}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="footer">
          <div className="footer-stats">
            <p>{totalCount - completedCount} tasks remaining</p>
          </div>
          
          <div className="footer-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-icon">{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            
            {totalCount > 0 && (
              <button 
                className="delete-all-btn" 
                onClick={deleteAll}
                title="Delete all tasks"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;