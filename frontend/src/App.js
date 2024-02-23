import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import AddList from './components/AddList';
import AuthService from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';
import apiClient from './services/apiClient'; // Make sure this is correctly set up

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(AuthService.getCurrentUser() != null);
    const [todoLists, setTodoLists] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTodoLists();
        }
    }, [isLoggedIn]);

    const fetchTodoLists = async () => {
        try {
            const response = await apiClient.get('/lists');
            if (response.status === 200) {
                setTodoLists(response.data);
            } else {
                throw new Error('Failed to fetch todo lists');
            }
        } catch (error) {
            console.error("Error fetching todo lists:", error);
            // Optionally, update the state to indicate an error to the user
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        setTodoLists([]);
    };

    return (
        <Router>
            <Navigation isLoggedIn={isLoggedIn} />
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
            {isLoggedIn && <AddList onListsUpdate={fetchTodoLists} />}
            <Routes>
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/todo-lists" element={<div>{todoLists.map(list => <TodoList key={list.id} list={list} onListUpdate={fetchTodoLists} />)}</div>} />
                </Route>
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;



