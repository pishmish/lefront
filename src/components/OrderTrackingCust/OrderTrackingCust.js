import React, { useEffect, useState } from "react";
import "./OrderTrackingCust.css";
import { fetchUserOrders } from '../../api/orderapi';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const OrderTrackingCust = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const steps = ["Processing", "In-transit", "Delivered"];

  const getOrders = async () => {
    try {
      const response = await fetchUserOrders();

      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  useEffect(() => {
    getOrders();
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="order-tracking-cust-container">
      {orders.length > 0 ? (
        // Filter out orders with totalPrice = $0.00
        orders.filter(order => parseFloat(order.totalPrice) !== 0).map((order) => {
          const currentStep = getCurrentStep(order.deliveryStatus);
          return (
            <div key={order.orderID} className="order-card">
              <button
                className="view-invoice-button"
                onClick={() => navigate(`/invoice/${order.orderID}`)}
              >
                View Invoice
              </button>
              <h4>Order ID: {order.orderID}</h4>
              <p>
                <strong>Order Number:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalPrice}
              </p>
              <p>
                <strong>Delivery Status:</strong> {order.deliveryStatus}
              </p>
              <p>
                <strong>Date of Order:</strong>{" "}
                {formatDate(order.timeOrdered)}
              </p>
              <p>
                <strong>Estimated Arrival:</strong>{" "}
                {formatDate(order.estimatedArrival)}
              </p>
              <div className="steps-container">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`step ${index <= currentStep ? "active" : ""}`}
                  >
                    <div className="circle">{index + 1}</div>
                    <p className="step-label">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button 
            className="start-shopping-button"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingCust;
