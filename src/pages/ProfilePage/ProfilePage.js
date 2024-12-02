import React from 'react';
import './ProfilePage.css';
import CustomerInfo from '../../components/CustomerInfo/CustomerInfo';
import OrderTrackingCust from '../../components/OrderTrackingCust/OrderTrackingCust';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <h1>Welcome, Customer!</h1>
      <CustomerInfo />
      
      {/* Order Tracking Component */}
      <OrderTrackingCust 
        orderId="12345"
        totalPrice="99.99"
        address="123 Main St, City, Country"
        invoice="INV123456"
        orderStatus="Processing"
      />
    </div>
  );
};

export default ProfilePage;
