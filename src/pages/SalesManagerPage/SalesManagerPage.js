import React, { useState } from 'react';
import SalesChart from '../../components/SalesChart/SalesChart';
import OrderList from '../../components/OrderList/OrderList';
import Refund from '../../components/Refund/Refund';
import SalesManagerProduct from '../../components/SalesManagerProduct/SalesManagerProduct';
import './SalesManagerPage.css';

const SalesManagerPage = () => {
  const [activeTab, setActiveTab] = useState('sales'); // Default olarak 'sales' seçili
  const [searchQuery, setSearchQuery] = useState(''); // Arama çubuğu için state

  return (
    <div className="sales-manager-page">
      <h1>Sales Dashboard</h1>

      {/* Navigation Buttons */}
      <div className="tabs-container">
        <button
          className={activeTab === 'sales' ? 'active-tab' : ''}
          onClick={() => setActiveTab('sales')}
        >
          Sales
        </button>
        <button
          className={activeTab === 'refund' ? 'active-tab' : ''}
          onClick={() => setActiveTab('refund')}
        >
          Refund
        </button>
        <button
          className={activeTab === 'products' ? 'active-tab' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'sales' && (
        <section className="sales-section">
          <h2>Sales Overview</h2>
          <div className="sales-chart-container">
            <SalesChart />
          </div>
          <OrderList />
        </section>
      )}

      {activeTab === 'refund' && (
        <section className="refund-section">
          <h2>Refund Requests</h2>
          {/* Search Bar for Refund Requests */}
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search by Request ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Refund searchQuery={searchQuery} />
        </section>
      )}

      {activeTab === 'products' && (
        <section className="products-section">
          <SalesManagerProduct username="sales_manager_username" />
        </section>
      )}
    </div>
  );
};

export default SalesManagerPage;
