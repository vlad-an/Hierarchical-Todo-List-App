import React, { useState } from 'react';
import apiClient from '../services/apiClient'; // Updated import for API client
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(username, password);
      setIsLoggedIn(true);
      navigate("/todo-lists");
    } catch (error) {
      let resMessage;
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        resMessage = error.response.data.message || error.message;
      } else if (error.request) {
        // The request was made but no response was received
        resMessage = "No response from server";
      } else {
        // Something else caused the error
        resMessage = error.message;
      }
      setMessage(resMessage);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};

export default Login;



