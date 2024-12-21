import React, { useState } from 'react';
import './RefundCust.css';

const RefundCust = () => {
  const [orders] = useState([
    { orderID: 1, totalPrice: 49.99 },
    { orderID: 2, totalPrice: 99.99 },
  ]);
  const [pastRequests] = useState([
    {
      requestID: 1,
      returnStatus: 'Pending',
      reason: 'Product was damaged upon arrival.',
      orderID: 1,
      productID: 23,
      quantity: 1,
    },
    {
      requestID: 2,
      returnStatus: 'Approved',
      reason: 'Size was too big.',
      orderID: 2,
      productID: 51,
      quantity: 1,
    },
  ]);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [reason, setReason] = useState('');

  const mockOrderDetails = {
    orderItems: [
      { productID: 1, productName: 'Product A', quantity: 2 },
      { productID: 2, productName: 'Product B', quantity: 1 },
    ],
  };

  const handleOrderSelect = (order) => {
    // Eğer seçili order'a tekrar tıklanırsa detaylar kapansın
    if (selectedOrder?.orderID === order.orderID) {
      setSelectedOrder(null);
      setOrderDetails(null);
      setRefundItems([]);
    } else {
      setSelectedOrder(order);
      setOrderDetails(mockOrderDetails);
      setRefundItems([]);
    }
  };

  const handleSubmit = () => {
    alert('Refund request submitted!');
    setSelectedOrder(null);
    setOrderDetails(null);
    setRefundItems([]);
    setReason('');
  };

  return (
    <div className="refund-cust">
      {/* Accordion for Past Requests */}
      <div className="past-requests">
        <div className="accordion-header" onClick={() => setAccordionOpen(!accordionOpen)}>
          <h2>Past Refund Requests</h2>
        </div>
        {accordionOpen && (
          <div className="accordion-body">
            {pastRequests.map((request) => (
              <div key={request.requestID} className="refund-card">
                <div className="refund-header">
                  <h3>Request ID: {request.requestID}</h3>
                  <p>Status: {request.returnStatus}</p>
                </div>
                <div className="refund-body">
                  <p><strong>Reason:</strong> {request.reason}</p>
                  <p><strong>Order ID:</strong> {request.orderID}</p>
                  <p><strong>Product ID:</strong> {request.productID}</p>
                  <p><strong>Quantity:</strong> {request.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="orders-list">
        <h2>Your Orders</h2>
        {orders.map((order) => (
          <div
            key={order.orderID}
            className={`order-item ${selectedOrder?.orderID === order.orderID ? 'selected' : ''}`}
            onClick={() => handleOrderSelect(order)}
          >
            <p>Order ID: {order.orderID}</p>
            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {orderDetails && (
        <div className="order-details">
          <h2>Order Details</h2>
          {orderDetails.orderItems.map((item) => (
            <div key={item.productID} className="order-item-detail">
              <div className="product-info">
                <p className="product-name">{item.productName}</p>
                <p className="product-quantity">Available Quantity: {item.quantity}</p>
              </div>
              <div className="return-quantity">
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  placeholder="Enter quantity"
                  onChange={(e) =>
                    setRefundItems((prevItems) =>
                      [...prevItems.filter((i) => i.productID !== item.productID), { productID: item.productID, quantity: parseInt(e.target.value, 10) }]
                    )
                  }
                />
              </div>
            </div>
          ))}
          <textarea
            placeholder="Reason for return"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          {/* Submit button directly under the textarea */}
          <button onClick={handleSubmit}>Submit Refund Request</button>
        </div>
      )}
    </div>
  );
};

export default RefundCust;
