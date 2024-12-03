// InvoicePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../../api/orderapi';
import { fetchAddressById } from '../../api/addressapi';
import './InvoicePage.css';

const InvoicePage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderAddress, setOrderAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await fetchOrder(orderId);
        console.log("response: ", response.data);
        setOrderDetails(response.data);
        const addressResponse = await fetchAddressById(response.data.deliveryAddressID);
        console.log("addressResponse: ", addressResponse.data);
        setOrderAddress(addressResponse.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="invoice-page">
      <div className="invoice-container">
        {/* <div className="invoice-header">
          <h1>Invoice</h1>
          <button className="print-button" onClick={handlePrint}>Print Invoice</button>
        </div> */}

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
                <th>Total</th>
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
        </div>

        <div className="invoice-total">
          <h2>Total: ${orderDetails?.totalPrice}</h2>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;