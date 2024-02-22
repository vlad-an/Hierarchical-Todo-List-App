import React from 'react';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login'); // Updated for react-router-dom v6
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;


