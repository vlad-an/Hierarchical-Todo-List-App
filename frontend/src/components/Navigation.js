import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ isLoggedIn }) => {
  return (
    <nav>
      {isLoggedIn ? (
        <>
          <Link to="/todo-lists">Todo Lists</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
