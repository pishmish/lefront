// pages/ProductManagerPage/ProductManagerPage.js
import React, { useState } from 'react';
import ProductManagement from '../../components/ProductManagement/ProductManagement';
import ReviewApproval from '../../components/ReviewApproval/ReviewApproval';
import './ProductManagerPage.css';

const ProductManagerPage = () => {
  const [activeTab, setActiveTab] = useState('product');

  const renderContent = () => {
    if (activeTab === 'product') {
      return (
        <section className="product-section">
          <h2>Product Management</h2>
          <ProductManagement />
        </section>
      );
    } else if (activeTab === 'reviews') {
      return (
        <section className="product-section">
          <h2>Review Approval</h2>
          <ReviewApproval />
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
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductManagerPage;
