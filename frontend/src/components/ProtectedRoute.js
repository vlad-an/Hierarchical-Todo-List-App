import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService';

const ProtectedRoute = () => {
  const isLoggedIn = AuthService.getCurrentUser() != null;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
