import React, { useEffect } from 'react';
import './ProfilePage.css';
import CustomerInfo from '../../components/CustomerInfo/CustomerInfo';
import OrderTrackingCust from '../../components/OrderTrackingCust/OrderTrackingCust';

const ProfilePage = () => {
  // Add useEffect to trigger cart update when component mounts
  useEffect(() => {
    // Dispatch CART_UPDATED event to refresh cart badge
    window.dispatchEvent(new Event('CART_UPDATED'));
  }, []);

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
