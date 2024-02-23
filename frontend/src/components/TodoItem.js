import React, { useState } from 'react';
import apiClient from '../services/apiClient';

function TodoItem({ item, onItemUpdate, onItemDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const handleEditSave = async () => {
    try {
      await apiClient.put(`/items/${item.id}`, {
        content: editedContent,
      });
      onItemUpdate({ ...item, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/items/${item.id}`);
      onItemDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEditSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{item.content}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

export default TodoItem;


