// pages/AdminPage/AdminPage.js
import React, { useState } from 'react';
import SalesChart from '../../components/SalesChart/SalesChart';
import OrderList from '../../components/OrderList/OrderList';
import ProductManagement from '../../components/ProductManagement/ProductManagement';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('sales'); // Default olarak "Sales" tab'ını seçili yapıyoruz

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
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* Tab Menü */}
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
      </div>

      {/* Seçilen sekmeye göre içerik */}
      {renderContent()}
    </div>
  );
};

export default AdminPage;
