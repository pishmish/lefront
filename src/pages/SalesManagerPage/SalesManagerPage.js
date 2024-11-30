// pages/SalesManagerPage/SalesManagerPage.js
import React from 'react';
import SalesChart from '../../components/SalesChart/SalesChart';
import OrderList from '../../components/OrderList/OrderList';
import './SalesManagerPage.css';

const SalesManagerPage = () => {
  return (
    <div className="sales-manager-page">
      <h1>Sales Dashboard</h1>
      <section className="sales-section">
        <h2>Sales Overview</h2>
        <div className="sales-chart-container">
          <SalesChart />
        </div>
        <OrderList />
      </section>
    </div>
  );
};

export default SalesManagerPage;
