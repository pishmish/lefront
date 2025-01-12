import React, { useState } from 'react';
import { registerUser } from '../../api/userapi'; // Import API function
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    taxID: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
    setErrorMessage('');
  };

  // Update handleSignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        address: formData.address,
        phone: formData.phone,
        taxID: formData.taxID
      };

      await registerUser(userData);
      setSuccessMessage('Account created successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Sign-up error:', error);
      setErrorMessage(error.response?.data?.msg || 'Error creating account. Please try again.');
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-form-container">
        <div className="sign-up-form">
          <h1>Sign Up</h1>
          <form onSubmit={currentStep === 2 ? handleSignUp : (e) => e.preventDefault()}>
            {currentStep === 1 ? (
              <>
                <div className="form-group">
                  <label htmlFor="name">Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number*</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username*</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="next-button-container">
                  <button type="button" onClick={handleNext} className="next-button">
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="taxID">Tax ID*</label>
                  <input
                    type="id"
                    id="taxID"
                    name="taxID"
                    value={formData.taxID}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.addressTitle">Address Title*</label>
                  <input
                    type="text"
                    id="address.addressTitle"
                    name="address.addressTitle"
                    value={formData.address.addressTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.country">Country*</label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.city">City*</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.zipCode">ZIP Code*</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.streetAddress">Street Address*</label>
                  <input
                    type="text"
                    id="address.streetAddress"
                    name="address.streetAddress"
                    value={formData.address.streetAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="button" onClick={handlePrevious} className="previous-button">
                    Previous
                  </button>
                  <button type="submit" className="submit-button">
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;