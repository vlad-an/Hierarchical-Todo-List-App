import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AuthService from './services/authService'; // Ensure you import AuthService
import Navigation from './components/Navigation'; // Make sure to create this component
import LogoutButton from './components/LogoutButton'; // And this component

function App() {
  const [todoLists, setTodoLists] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch todo lists from the backend on component mount
      // Ensure your request uses the authentication token if required
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    AuthService.logout(); // Call the logout method from AuthService
    setIsLoggedIn(false); // Update state to reflect logout
    window.location.reload(); // Optionally, force reload to clear application state
  };

  return (
    <Router>
      <div>
        {isLoggedIn && (
          <nav>
            <Link to="/todo-lists">Todo Lists</Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        )}
        <Switch>
          <Route path="/login" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/todo-lists" component={() => todoLists.map(list => <TodoList key={list.id} list={list} />)} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
