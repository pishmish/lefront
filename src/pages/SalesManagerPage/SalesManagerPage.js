import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import SalesChart from '../../components/SalesChart/SalesChart';
import OrderList from '../../components/OrderList/OrderList';
import Refund from '../../components/Refund/Refund';
import SalesDiscounts from '../../components/SalesDiscounts/SalesDiscounts';
import SalesPrices from '../../components/SalesPrices/SalesPrices';
import './SalesManagerPage.css';

const SalesManagerPage = () => {
  const [activeTab, setActiveTab] = useState('sales'); // Default olarak 'sales' seçili
  const [searchQuery, setSearchQuery] = useState(''); // Arama çubuğu için state
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
          className={activeTab === 'discounts' ? 'active-tab' : ''}
          onClick={() => setActiveTab('discounts')}
        >
          Discounts
        </button>
        <button
          className={activeTab === 'prices' ? 'active-tab' : ''}
          onClick={() => setActiveTab('prices')}
        >
          Prices
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
          <h2>Refund Management</h2>
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

      {activeTab === 'discounts' && (
        <section className="discounts-section">
          <h2>Discounts Management</h2>
          <SalesDiscounts username={username} />
        </section>
      )}

      {activeTab === 'prices' && (
        <section className="prices-section">
          <h2>Price Management</h2>
          <SalesPrices username={username} />
        </section>
      )}
    </div>
  );
};

export default SalesManagerPage;
