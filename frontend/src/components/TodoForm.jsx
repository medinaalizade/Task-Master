import { useState } from 'react';
import axios from 'axios';

const API_URL = '/api/todos';

function TodoForm({ onTodoAdded }) {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, { title });
      onTodoAdded(response.data);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`todo-form ${isFocused ? 'focused' : ''}`}>
      <div className="input-wrapper">
        <span className="input-icon">✨</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
      </div>
      <button type="submit" className="add-btn" disabled={!title.trim()}>
        <span>Add</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </form>
  );
}

export default TodoForm;