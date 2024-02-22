// Assuming AddList.js is located in /src/components/
import React, { useState } from 'react';
import axios from 'axios';
import AuthService from '../services/authService'; // Correct path if AuthService is in /src/services/

function AddList({ onListsUpdate }) {
  const [newListTitle, setNewListTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddList = async (e) => {
    e.preventDefault();
    const authToken = AuthService.getAuthToken();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/api/lists`, {
        title: newListTitle
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setNewListTitle('');
      setShowForm(false);
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
