import React, { useState } from 'react';
import TodoItem from './TodoItem'; // Verify this import path is correct
import apiClient from '../services/apiClient'; // Updated import
import AuthService from '../services/authService'; // Keep if needed for other uses

function TodoList({ list, onListUpdate }) {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For user feedback

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemContent.trim()) {
      setFeedbackMessage("Item content cannot be empty.");
      return;
    }
    try {
      await apiClient.post(`/lists/${list.id}/items`, { // Using apiClient for the request
        content: newItemContent,
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




