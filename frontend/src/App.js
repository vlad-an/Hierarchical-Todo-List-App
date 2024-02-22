import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import AddList from './components/AddList';
import AuthService from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(AuthService.getCurrentUser() != null);
    const [todoLists, setTodoLists] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTodoLists();
        }
    }, [isLoggedIn]);

    async function fetchTodoLists() {
        const authToken = AuthService.getAuthToken();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/api/lists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTodoLists(data);
            } else {
                throw new Error('Failed to fetch todo lists');
            }
        } catch (error) {
            console.error("Error fetching todo lists:", error);
        }
    }

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        setTodoLists([]);
    };

    const refreshTodoLists = () => {
        fetchTodoLists();
    };

    return (
        <Router>
            <Navigation isLoggedIn={isLoggedIn} />
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
            {isLoggedIn && <AddList onListsUpdate={refreshTodoLists} />}
            <Routes>
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/todo-lists" element={<ProtectedRoute isLoggedIn={isLoggedIn}>
                    <div>
                        {todoLists.map(list => <TodoList key={list.id} list={list} onListUpdate={refreshTodoLists} />)}
                    </div>
                </ProtectedRoute>} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;



