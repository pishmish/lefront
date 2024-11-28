import React, { useState } from 'react';
import { registerUser } from '../../api/userapi'; // Import API function
import './SignUpPage.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: {
      addressTitle: '',
      country: '',
      city: '',
      zipCode: '',
      streetAddress: '',
    },
    phone: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: { ...formData.address, [name]: value },
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const {
        name,
        email,
        username,
        password,
        address,
        phone,
      } = formData;

      const userData = { name, email, username, password, address, phone };
      await registerUser(userData); // API call to register user

      setSuccessMessage('Account created successfully!');
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        address: {
          addressTitle: '',
          country: '',
          city: '',
          zipCode: '',
          streetAddress: '',
        },
        phone: '',
      });
    } catch (error) {
      console.error('Sign-up error:', error);
      setErrorMessage(
        error.response?.data?.msg || 'Error creating account. Please try again.'
      );
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-form-container">
        <div className="sign-up-welcome">
          <h1>Welcome to Zad à Dos!</h1>
          <p>Create an account to unlock exclusive deals and enjoy shopping with ease!</p>
        </div>
        <div className="sign-up-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="addressTitle"
                placeholder="Address Title"
                value={formData.address.addressTitle}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={formData.address.streetAddress}
                onChange={handleAddressChange}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button type="submit" className="sign-up-button">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
