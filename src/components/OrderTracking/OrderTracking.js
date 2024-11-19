import React from "react";
import "./OrderTracking.css";

const OrderTracking = ({ currentStep }) => {
  const steps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <div className="order-tracking-container">
      <h4>Order Tracking</h4>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= currentStep ? "active" : ""}`}>
            <div className="circle">{index + 1}</div>
            <p className="step-label">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
