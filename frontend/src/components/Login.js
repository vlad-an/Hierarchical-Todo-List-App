// src/components/Login.js

import React, { useState } from 'react';
import AuthService from '../services/authService';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory(); // Use useHistory hook for redirection

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");

    AuthService.login(username, password).then(
      (data) => {
        localStorage.setItem('user', JSON.stringify(data)); // Store the user token
        history.push("/todo-lists"); // Redirect to todo lists page after login
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      }
    );
  };

  return (
    <div>
      {/* Your login form here */}
    </div>
  );
};

export default Login;
