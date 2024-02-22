// frontend/src/components/TodoList.js
import React, { useState } from 'react';
import TodoItem from './TodoItem'; // Verify this import path is correct
import axios from 'axios';
import AuthService from '../services/authService';

function TodoList({ list, onListUpdate }) {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For user feedback

  const authToken = AuthService.getAuthToken();

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemContent.trim()) {
      setFeedbackMessage("Item content cannot be empty.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000'}/api/lists/${list.id}/items`, {
        content: newItemContent,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setShowAddItemForm(false);
      setNewItemContent('');
      setFeedbackMessage('');
      onListUpdate(); // Triggers a refresh of the list items, consider re-fetching or updating state
    } catch (error) {
      console.error('Error adding item:', error);
      setFeedbackMessage('Failed to add item. Please try again.');
    }
  };

  return (
    <div>
      <h2>{list.title}</h2>
      {list.items && list.items.map(item => (
        <TodoItem key={item.id} item={item} onItemUpdate={onListUpdate} />
      ))}
      <button onClick={() => setShowAddItemForm(!showAddItemForm)}>
        {showAddItemForm ? 'Cancel' : 'Add Item'}
      </button>
      {showAddItemForm && (
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Item content"
            value={newItemContent}
            onChange={e => setNewItemContent(e.target.value)}
          />
          <button type="submit">Save Item</button>
        </form>
      )}
      {feedbackMessage && <p>{feedbackMessage}</p>} {/* Display feedback message */}
    </div>
  );
}

export default TodoList;



