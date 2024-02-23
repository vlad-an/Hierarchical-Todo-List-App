import React, { useState } from 'react';
import apiClient from '../services/apiClient'; // Use the centralized API client
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/register', {
        username,
        password
      });
      setMessage(response.data.message);
      navigate("/login"); // Navigate to login on successful registration
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
        {message && <div className={message ? "alert alert-danger" : ""} role="alert">
            {message}
        </div>}
      </form>
    </div>
  );
};

export default Register;



