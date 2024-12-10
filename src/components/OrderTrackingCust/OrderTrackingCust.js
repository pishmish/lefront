import React, { useEffect, useState } from "react";
import "./OrderTrackingCust.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const OrderTrackingCust = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const steps = ["Processing", "In-transit", "Delivered"];

  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/order/user", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setOrders(response.data);
        console.log("Orders fetched:", response.data); // Log orders
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

  return (
    <div className="order-tracking-cust-container">
      {orders.length > 0 ? (
        orders.map((order) => {
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
                <strong>Estimated Arrival:</strong>{" "}
                {new Date(order.estimatedArrival).toLocaleDateString()}
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
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrderTrackingCust;
