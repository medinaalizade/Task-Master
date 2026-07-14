import axios from 'axios';

const API_URL = '/api/todos';

function TodoItem({ todo, index, onUpdate, onDelete }) {
  const toggleComplete = async () => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, {
        completed: !todo.completed
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    // Add exit animation before deleting
    const element = document.getElementById(`todo-${todo._id}`);
    if (element) {
      element.style.transform = 'translateX(100px)';
      element.style.opacity = '0';
      await new Promise(r => setTimeout(r, 300)); // Wait for animation
    }
    
    try {
      await axios.delete(`${API_URL}/${todo._id}`);
      onDelete(todo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div 
      id={`todo-${todo._id}`}
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        <span className="checkmark"></span>
      </label>
      
      <span className="todo-title">{todo.title}</span>
      
      <button onClick={handleDelete} className="delete-btn" title="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
}

export default TodoItem;