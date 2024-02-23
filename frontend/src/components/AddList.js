// frontend/src/components/AddList.js

import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import AuthService from '../services/authService';

function AddList({ onListsUpdate }) {
  const [newListTitle, setNewListTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddList = async (e) => {
    e.preventDefault();
    const authToken = AuthService.getAuthToken();
    try {
      await apiClient.post('/lists', { // Using apiClient for the request
        title: newListTitle
      });
      setNewListTitle('');
      setShowForm(false);
      // Fetch updated lists after adding a new one
      onListsUpdate();
    } catch (error) {
      console.error('Error adding list:', error);
      // Handle error appropriately
    }
  };

  return (
    <>
      <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add New List'}</button>
      {showForm && (
        <form onSubmit={handleAddList}>
          <input 
            type="text" 
            placeholder="List Title" 
            value={newListTitle} 
            onChange={(e) => setNewListTitle(e.target.value)} 
          />
          <button type="submit">Add List</button>
        </form>
      )}
    </>
  );
}

export default AddList;


