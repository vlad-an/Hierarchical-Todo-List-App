import React, { useState } from 'react';
import apiClient from '../services/apiClient'; // Updated import for API client
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/login', { username, password });
      AuthService.login(response.data); // Assuming login method handles setting user data in localStorage
      navigate("/todo-lists");
      window.location.reload();
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
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



