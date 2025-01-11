import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    avatar: null,
    password: '',
    confirmPassword: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  localStorage.clear();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({ ...formData, avatar: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.password || !formData.email || !formData.phone) {
      setError('All fields are required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === formData.email || user.phone === formData.phone);

    if (userExists) {
      setError('User with this email or phone already exists.');
      return;
    }


    const userData = {
      name: formData.name,
      avatar: formData.avatar, // This is already a base64 string
      password: formData.password,
      email: formData.email,
      phone: formData.phone
    };

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(userData)); // Store current user data
    navigate('/login');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="avatar-upload">
          <label htmlFor="avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
            ) : (
              <div className="avatar-placeholder">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'Upload Avatar'}
              </div>
            )}
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone *"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="register-button">Sign Up</button>
        <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
