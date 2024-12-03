import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderTracking.css";

const OrderTracking = () => {
  const steps = ["Processing", "In-transit", "Delivered"];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h3>Order Tracking</h3>
      <div className="order-grid">
        {orders.length > 0 ? (
          orders.map((order) => {
            const currentStep = getCurrentStep(order.deliveryStatus);
            return (
              <div key={order.orderID} className="order-card">
                <h4>Order ID: {order.orderID}</h4>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                <p><strong>Estimated Arrival:</strong> {new Date(order.estimatedArrival).toLocaleDateString()}</p>
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
