import React, { useState } from "react";
import "./OrderTrackingCust.css";

const OrderTrackingCust = ({ orderId, totalPrice, address, invoice, orderStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="order-tracking-cust-container">
      {/* Ana Akordeon Başlığı */}
      <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h4>Order ID: {orderId}</h4>
      </div>

      {/* Ana Akordeon İçeriği */}
      {isExpanded && (
        <div className="accordion-content">
          {/* Sipariş İçeriği */}
          <div className="order-content">
            <p><strong>Order Content:</strong></p>
            <p><strong>Total Price:</strong> ${totalPrice}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Invoice:</strong> {invoice}</p>
            <p><strong>Order Status:</strong> {orderStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingCust;
