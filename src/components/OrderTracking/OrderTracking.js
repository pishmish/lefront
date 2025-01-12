import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderTracking.css";
import { fetchOrder } from '../../api/orderapi';
import { fetchAddressById } from '../../api/addressapi';

const OrderTracking = () => {
  const steps = ["Processing", "In-transit", "Delivered"];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [orderDetails, setOrderDetails] = useState({});
  const [showDelivered, setShowDelivered] = useState(false);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/order/getallorders",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        console.error("Error fetching orders");
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderID, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/delivery/order/${orderID}/status`,
        { deliveryStatus: newStatus },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderID ? { ...order, deliveryStatus: newStatus } : order
          )
        );
      } else {
        console.error("Error updating order status");
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const toggleOrderExpand = async (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (expandedOrders.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      if (!orderDetails[orderId]) {
        try {
          const response = await fetchOrder(orderId);
          console.log('Order details:', response.data);
          const addressResponse = await fetchAddressById(response.data.deliveryAddressID);
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: {
              ...response.data,
              address: addressResponse.data
            }
          }));
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      }
    }
    setExpandedOrders(newExpanded);
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const getCurrentStep = (status) => {
    switch (status) {
      case "Processing":
        return 0;
      case "In-transit":
        return 1;
      case "Delivered":
        return 2;
      default:
        return -1; // Undefined step
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-tracking-container">
      
      <div className="filter-section">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={showDelivered}
            onChange={(e) => setShowDelivered(e.target.checked)}
          />
          Show Delivered Orders
        </label>
      </div>

      <div className="order-grid">
        {orders.length > 0 ? (
          orders
            .filter(order => parseFloat(order.totalPrice) !== 0)
            .filter(order => showDelivered || order.deliveryStatus !== 'Delivered')
            .map((order) => {
              const currentStep = getCurrentStep(order.deliveryStatus);
              const isExpanded = expandedOrders.has(order.orderID);
              return (
                <div key={order.orderID} className="order-card">
                  <div className="order-header">
                    <h4>Order ID: {order.orderID}</h4>
                    <button 
                      className="expand-button"
                      onClick={() => toggleOrderExpand(order.orderID)}
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                  </div>

                  <p><strong>Customer ID:</strong> {order.customerID}</p>
                  <p><strong>Order Number:</strong> {order.orderNumber}</p>
                  <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                  <p><strong>Delivery ID:</strong> {order.deliveryID}</p>
                  <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                  <p><strong>Estimated Arrival:</strong> {new Date(order.estimatedArrival).toLocaleDateString()}</p>

                  {isExpanded && orderDetails[order.orderID] && (
                    <div className="order-details-expanded">
                      <div className="order-items">
                        <h4>Ordered Items</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderDetails[order.orderID].orderItems?.map((item) => (
                              <tr key={item.productID}>
                                <td>{item.productID}</td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>${parseFloat(item.purchasePrice).toFixed(2)}</td>
                                <td>${(parseFloat(item.quantity) * parseFloat(item.purchasePrice)).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="delivery-address">
                        <h4>Delivery Address</h4>
                        <p>{orderDetails[order.orderID].address?.streetAddress}</p>
                        <p>{orderDetails[order.orderID].address?.city}, {orderDetails[order.orderID].address?.province}</p>
                        <p>{orderDetails[order.orderID].address?.zipCode}</p>
                        <p>{orderDetails[order.orderID].address?.country}</p>
                      </div>
                    </div>
                  )}
                  <div className="steps-container">
                    {steps.map((step, index) => (
                      <div key={index} className={`step ${index <= currentStep ? "active" : ""}`}>
                        <div className="circle">{index + 1}</div>
                        <p className="step-label">{step}</p>
                      </div>
                    ))}
                  </div>
                  <div className="status-buttons">
                    {steps.map((step) => (
                      <button
                        key={step}
                        className={`status-button ${step === order.deliveryStatus ? "active" : ""}`}
                        onClick={() => updateOrderStatus(order.orderID, step)}
                        disabled={step === order.deliveryStatus}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
