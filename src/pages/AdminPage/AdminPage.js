// pages/AdminPage/AdminPage.js
import React, { useState } from 'react';
import SalesChart from '../../components/SalesChart/SalesChart';
import OrderList from '../../components/OrderList/OrderList';
import ProductManagement from '../../components/ProductManagement/ProductManagement';
import ReviewApproval from '../../components/ReviewApproval/ReviewApproval'; // Yeni component
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const renderContent = () => {
    if (activeTab === 'sales') {
      return (
        <section className="admin-section">
          <h2>Sales Overview</h2>
          <div className="sales-chart-container">
            <SalesChart />
          </div>
          <OrderList />
        </section>
      );
    } else if (activeTab === 'product') {
      return (
        <section className="admin-section">
          <h2>Product Management</h2>
          <ProductManagement />
        </section>
      );
    } else if (activeTab === 'reviews') {
      return (
        <section className="admin-section">
          <h2>Review Approval</h2>
          <ReviewApproval />
        </section>
      );
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          Sales
        </button>
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

export default AdminPage;
