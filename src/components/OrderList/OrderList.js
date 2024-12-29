// components/OrderList/OrderList.js
import React, { useState, useEffect } from 'react';
import { fetchSupplierOrders } from '../../api/orderapi';
import { jwtDecode } from 'jwt-decode';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!orders.length) return <div>No orders found</div>;

  return (
    <div className="order-list-container">
      <h3>Recent Orders</h3>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
