import React from 'react';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout(); // Clears the user token from localStorage
    navigate('/login'); // Navigates the user back to the login page
    window.location.reload(); // Optional: Refresh the page to clear any user data
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;


