// frontend/src/components/TodoItem.js
import React, { useState } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';

function TodoItem({ item, onItemUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(item.content);

    const authToken = AuthService.getAuthToken(); // Ensure AuthService includes getAuthToken

    const handleEditSave = () => {
        axios.put(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/api/items/${item.id}`, {
            content: editedContent,
        }, {
            headers: { Authorization: `Bearer ${authToken}` },
        }).then(() => {
            setIsEditing(false);
            onItemUpdate(); // This function should trigger a refresh of the items
        }).catch(error => console.error('Error updating item:', error));
    };

    const handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/api/items/${item.id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        }).then(() => {
            onItemUpdate(); // Refresh items upon deletion
        }).catch(error => console.error('Error deleting item:', error));
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


