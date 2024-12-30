// components/OrderList/OrderList.js
import React, { useState, useEffect } from 'react';
import { fetchSupplierOrders, downloadInvoiceById } from '../../api/orderapi';
import { jwtDecode } from 'jwt-decode';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='));
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const decodedToken = jwtDecode(token.split('=')[1]);
        const username = decodedToken.id;

        if (!username) {
          throw new Error('Username not found in token');
        }

        const response = await fetchSupplierOrders(username);
        //console.log('response:', response.data);
        if (response.status === 200 && Array.isArray(response.data)) {
          // Sort orders by orderID
          const sortedOrders = response.data.sort((a, b) => 
            (a.order.orderID || 0) - (b.order.orderID || 0)
          );
          setOrders(sortedOrders);
        } else {
          throw new Error('Invalid data format received');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await downloadInvoiceById(orderId);
      console.log('Invoice response:', response);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!startDate && !endDate) return true;
    
    const orderDate = new Date(order.order.timeOrdered);
    
    // Set time to start of day for start date
    const start = startDate ? new Date(startDate + 'T00:00:00') : null;
    
    // Set time to end of day for end date
    const end = endDate ? new Date(endDate + 'T23:59:59') : null;
    
    console.log('Order date:', orderDate);
    console.log('Start date:', start);
    console.log('End date:', end);
    
    if (start && end) {
      return orderDate >= start && orderDate <= end;
    } else if (start) {
      return orderDate >= start;
    } else if (end) {
      return orderDate <= end;
    }
    return true;
  });

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!orders.length) return <div>No orders found</div>;

  return (
    <div className="order-list-container">
      <h3>Past Orders</h3>
      
      <div className="date-filter">
        <div className="date-input">
          <label>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input">
          <label>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Time</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.order.orderID}>
              <td>{order.order.orderID || 'N/A'}</td>
              <td>${(order.order.totalPrice || 0)}</td>
              <td>
                <span className={`status-${(order.status || '').toLowerCase()}`}>
                  {order.order.deliveryStatus || 'Unknown'}
                </span>
              </td>
              <td>
                {order.order.timeOrdered ? 
                  new Date(order.order.timeOrdered).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 
                  'N/A'
                }
              </td>
              <td>
                {order.order.timeOrdered ? 
                  new Date(order.order.timeOrdered).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) :
                  'N/A'
                }
              </td>
              <td>
                <button 
                  className="invoice-button"
                  onClick={() => handleDownloadInvoice(order.order.orderID)}
                >
                  View Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
