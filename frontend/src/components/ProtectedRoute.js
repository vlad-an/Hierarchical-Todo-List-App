// src/components/ProtectedRoute.js


import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user;
  };

  return (
    <Route {...rest} render={
      props => isLoggedIn() ? (<Component {...props} />) : (<Redirect to="/login" />)
    } />
  );
};

export default ProtectedRoute;

