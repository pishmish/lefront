import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import CustomerInfo from '../../components/CustomerInfo/CustomerInfo';
import OrderTrackingCust from '../../components/OrderTrackingCust/OrderTrackingCust';
import RefundCust from '../../components/RefundCust/RefundCust';

const ProfilePage = () => {
  const [activeComponent, setActiveComponent] = useState('orderTracking');

  useEffect(() => {
    // Dispatch CART_UPDATED event to refresh cart badge
    window.dispatchEvent(new Event('CART_UPDATED'));
  }, []);

  return (
    <div className="profile-page">
      <h1>Welcome, Customer!</h1>
      <CustomerInfo />

      {/* Buttons to toggle between OrderTrackingCust and RefundCust */}
      <div className="component-toggle-buttons">
        <button
          className={activeComponent === 'orderTracking' ? 'active' : ''}
          onClick={() => setActiveComponent('orderTracking')}
        >
          Order Tracking
        </button>
        <button
          className={activeComponent === 'refund' ? 'active' : ''}
          onClick={() => setActiveComponent('refund')}
        >
          Order & Refund Management
        </button>
      </div>

      {/* Conditionally render components based on the activeComponent state */}
      <div className="component-display">
        {activeComponent === 'orderTracking' && <OrderTrackingCust />}
        {activeComponent === 'refund' && <RefundCust />}
      </div>
    </div>
  );
};

export default ProfilePage;
