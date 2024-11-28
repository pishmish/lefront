import React from 'react';
import './ProfilePage.css';
import CustomerInfo from '../../components/CustomerInfo/CustomerInfo';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <h1>Welcome, Customer!</h1>
      <CustomerInfo />
    </div>
  );
};

export default ProfilePage;
