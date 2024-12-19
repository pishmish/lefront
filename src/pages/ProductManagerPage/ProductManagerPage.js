// pages/ProductManagerPage/ProductManagerPage.js
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProductManagement from '../../components/ProductManagement/ProductManagement';
import ReviewApproval from '../../components/ReviewApproval/ReviewApproval';
import OrderTracking from '../../components/OrderTracking/OrderTracking'; // OrderTracking bileşenini import ettik
import './ProductManagerPage.css';

const ProductManagerPage = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [username, setUsername] = useState('');

  useEffect(() => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='));
      
      if (token) {
        const decodedToken = jwtDecode(token.split('=')[1]);
        setUsername(decodedToken.id); // Assuming username is stored as 'id' in token
        // console.log('Decoded token:', decodedToken);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const renderContent = () => {
    if (activeTab === 'product') {
      return (
        <section className="product-section">
          <ProductManagement username={username} />
        </section>
      );
    } else if (activeTab === 'reviews') {
      return (
        <section className="product-section">
          <ReviewApproval username={username} />
        </section>
      );
    } else if (activeTab === 'orders') {
      return (
        <section className="product-section">
          <OrderTracking />
        </section>
      );
    }
  };

  return (
    <div className="product-manager-page">
      <h1>Product Dashboard</h1>
      <div className="product-tabs">
        <button
          className={`tab-button ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          Product
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductManagerPage;
