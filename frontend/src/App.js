import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList'; // Import the TodoList component

function App() {
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    // Fetch todo lists from the backend on component mount
    axios.get('/api/lists')
      .then(response => setTodoLists(response.data))
      .catch(error => console.error('There was an error retrieving the todo lists: ', error));
  }, []);

  return (
    <div>
      <h1>Todo Lists</h1>
      {todoLists.map(list => <TodoList key={list.id} list={list} />)}
    </div>
  );
}

export default App;