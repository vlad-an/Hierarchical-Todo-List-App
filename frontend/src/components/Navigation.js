import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';

const Navigation = () => {
  const isLoggedIn = AuthService.getCurrentUser() != null;

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <Link to="/todo-lists">Todo Lists</Link>
          {/* Assuming LogoutButton is imported and used here if needed */}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
