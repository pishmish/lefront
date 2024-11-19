import React, { useState } from "react";
import "./CustomerInfo.css";
import OrderTracking from "../OrderTracking/OrderTracking";

const PastOrders = () => {
  const orders = [
    { 
      id: 12345, 
      details: "Delivered on 12th Nov 2024", 
      currentStep: 4, 
      address: "123 Main St, Springfield", 
      items: ["Leather Tote Bag", "Silk Scarf"] 
    },
    { 
      id: 67890, 
      details: "Shipped, expected delivery on 15th Nov 2024", 
      currentStep: 2, 
      address: "456 Elm St, Metropolis", 
      items: ["Canvas Backpack"] 
    },
    { 
      id: 54321, 
      details: "Processing, estimated shipping: 13th Nov 2024", 
      currentStep: 1, 
      address: "789 Oak Ave, Gotham", 
      items: ["Woolen Hat", "Winter Gloves"] 
    },
  ];

  const [activeOrder, setActiveOrder] = useState(null);

  const toggleOrder = (id) => {
    setActiveOrder(activeOrder === id ? null : id);
  };

  return (
    <div className="past-orders">
      <h3>Past Orders</h3>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div
            className={`order-header ${activeOrder === order.id ? "active" : ""}`}
            onClick={() => toggleOrder(order.id)}
          >
            <p className="order-id">Order #{order.id}</p>
          </div>
          {activeOrder === order.id && (
            <div className="order-details">
              <p><strong>Status:</strong> {order.details}</p>
              <p><strong>Delivery Address:</strong> {order.address}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <OrderTracking currentStep={order.currentStep} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CustomerInfo = () => {
  return (
    <div className="customer-info">
      <h2>Customer Information</h2>
      <div>
        <p><strong>Default Address:</strong> 123 Main St, Springfield</p>
        <p><strong>Default Card Info:</strong> **** **** **** 1234</p>
      </div>
      <PastOrders />
    </div>
  );
};

export default CustomerInfo;
