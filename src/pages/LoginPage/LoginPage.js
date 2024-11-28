import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/userapi'; // Import the login API function
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      // Send login request to the backend
      const response = await loginUser({ username, password });
      const { role } = response.data; // Extract role from the response

      // Redirect based on the user's role
      if (role === 'customer') {
        navigate('/profile');
      }
      else if (role === 'productManager') {
        navigate('/admin'); // for now it takes to the admin page
      } else if (role === 'salesManager') {
        navigate('/admin');
      } else { // for now it takes to the admin page
        setErrorMessage('Unknown role. Please contact support.');
      }
    } catch (error) {
      // Handle login errors
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.msg || 'Invalid username or password. Please try again.'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
