import React from 'react';
import './CustomerLoginPage.css';
import CustomerInfo from '../../components/CustomerInfo/CustomerInfo';

const CustomerLoginPage = () => {
  return (
    <div className="customer-login-page">
      <h1>Welcome, Customer!</h1>
      <CustomerInfo />
    </div>
  );
};

export default CustomerLoginPage;
