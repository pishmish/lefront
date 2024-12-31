// InvoicePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder, downloadInvoiceById } from '../../api/orderapi';
import { fetchAddressById } from '../../api/addressapi';
import { fetchUserProfile } from '../../api/userapi';
import './InvoicePage.css';

const InvoicePage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderAddress, setOrderAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add useEffect to trigger cart update when component mounts
  useEffect(() => {
    // Dispatch CART_UPDATED event to refresh cart badge
    window.dispatchEvent(new Event('CART_UPDATED'));
  }, []);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await fetchOrder(orderId);
        setOrderDetails(response.data);

        const addressResponse = await fetchAddressById(response.data.deliveryAddressID);
        setOrderAddress(addressResponse.data);

        // Removed the email sending code from here

      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const handlePrint = async () => {
    try {
      const response = await downloadInvoiceById(orderId);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (err) {
      console.error('Error downloading invoice:', err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="invoice-page">
      <div className="invoice-container">
        <div className="invoice-header">
          <h1>Invoice</h1>
          <div className="invoice-header-content">
            <p>The invoice has been sent to your email!</p>
            <button className="print-button" onClick={handlePrint}>Print Invoice</button>
          </div>
        </div>

        <div className="invoice-info">
          <div className="order-details">
            <h2>Order Details</h2>
            <p>Order ID: {orderDetails?.orderID}</p>
            <p>Date: {new Date(orderDetails?.timeOrdered).toLocaleDateString()}</p>
          </div>
          <div className="order-address">
            <h2>ORDER ADDRESS</h2>
            <p>{orderAddress?.streetAddress}, {orderAddress?.zipCode}</p>
            <p>{orderAddress?.city}/{orderAddress?.province}</p>
            <p>{orderAddress?.country}</p>
          </div>
        </div>

        <div className="order-items">
          <h2>Ordered Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.orderItems?.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${parseFloat(item.purchasePrice).toFixed(2)}</td>
                  <td>${(parseFloat(item.quantity) * parseFloat(item.purchasePrice)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="invoice-divider" />
          <div className="total-section">
            <p>Total: ${orderDetails?.orderItems?.reduce((sum, item) => 
              sum + (parseFloat(item.quantity) * parseFloat(item.purchasePrice)), 0).toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;