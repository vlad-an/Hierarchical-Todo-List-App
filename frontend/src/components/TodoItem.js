import React, { useState } from 'react';
import apiClient from '../services/apiClient'; // Updated import
import AuthService from '../services/authService'; // Keep if needed for other purposes

function TodoItem({ item, onItemUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(item.content);

    const handleEditSave = async () => {
        try {
            await apiClient.put(`/items/${item.id}`, { // Using apiClient for the request
                content: editedContent,
            });
            setIsEditing(false);
            onItemUpdate(); // This function should trigger a refresh of the items
        } catch (error) {
            console.error('Error updating item:', error);
            // Optionally, handle error with user feedback
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/items/${item.id}`); // Using apiClient for the request
            onItemUpdate(); // Refresh items upon deletion
        } catch (error) {
            console.error('Error deleting item:', error);
            // Optionally, handle error with user feedback
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



