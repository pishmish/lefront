// pages/ProductManagerPage/ProductManagerPage.js
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProductManagement from '../../components/ProductManagement/ProductManagement';
import ReviewApproval from '../../components/ReviewApproval/ReviewApproval';
import OrderTracking from '../../components/OrderTracking/OrderTracking';
import CategoryManagement from '../../components/CategoryManagement/CategoryManagement';
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
        setUsername(decodedToken.id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  return (
    <div className="product-manager-page">
      <h1>Product Dashboard</h1>

      <div className="tabs-container">
        <button
          className={activeTab === 'product' ? 'active-tab' : ''}
          onClick={() => setActiveTab('product')}
        >
          Products
        </button>
        <button
          className={activeTab === 'reviews' ? 'active-tab' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={activeTab === 'orders' ? 'active-tab' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'category' ? 'active-tab' : ''}
          onClick={() => setActiveTab('category')}
        >
          Category
        </button>
      </div>

      {activeTab === 'product' && (
        <section className="product-section">
          <h2>Product Management</h2>
          <ProductManagement username={username} />
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="product-section">
          <h2>Review Approval</h2>
          <ReviewApproval username={username} />
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="product-section">
          <h2>Order Tracking</h2>
          <OrderTracking />
        </section>
      )}

      {activeTab === 'category' && (
        <section className="product-section">
          <h2>Category Management</h2>
          <CategoryManagement />
        </section>
      )}
    </div>
  );
};

export default ProductManagerPage;
