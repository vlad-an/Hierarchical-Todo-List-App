import React, { useState } from 'react';
import TodoItem from './TodoItem';
import apiClient from '../services/apiClient';

function TodoList({ list, onListUpdate }) {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [items, setItems] = useState(list.items || []); // Initialize items from the list

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemContent.trim()) {
      setFeedbackMessage("Item content cannot be empty.");
      return;
    }
    try {
      const response = await apiClient.post(`/items/${list.id}`, {
        content: newItemContent,
      });
      const newItem = { id: response.data.id, content: newItemContent };
      setItems(currentItems => [...currentItems, newItem]);
      
      setShowAddItemForm(false);
      setNewItemContent('');
      setFeedbackMessage('');
    } catch (error) {
      console.error('Error adding item:', error);
      setFeedbackMessage('Failed to add item. Please try again.');
    }
  };

  const updateItemInList = (updatedItem) => {
    setItems(currentItems => currentItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteItemFromList = (itemId) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  return (
    <div>
      <h2>{list.title}</h2>
      {items.map(item => (
        <TodoItem 
          key={item.id} 
          item={item} 
          onItemUpdate={updateItemInList} 
          onItemDelete={deleteItemFromList} 
        />
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
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
}

export default TodoList;





