// Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../slices/authSlice';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials)).then(() => navigate('/'));
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;


