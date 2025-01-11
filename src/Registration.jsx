import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../slices/authSlice';
import './Login.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    dispatch(register(formData)).then(() => navigate('/'));
  };

  return (
    <div className="login-container">
      <form className="login-form registration-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          className="input-field"
        />
        <div className="avatar-upload">
          <label htmlFor="avatar">Avatar (optional)</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;

