import React, { useState } from 'react';
import './Refund.css';

const Refund = ({ searchQuery }) => {
  const [refundRequests, setRefundRequests] = useState([
    {
      requestID: 1,
      returnStatus: 'Pending',
      reason: 'Product was damaged upon arrival.',
      orderID: 1,
      productID: 23,
      quantity: 1,
      customerID: 2,
    },
    {
      requestID: 2,
      returnStatus: 'Approved',
      reason: 'Size was too big.',
      orderID: 2,
      productID: 51,
      quantity: 1,
      customerID: 1,
    },
  ]);

  // Filter refunds based on search query
  const filteredRequests = refundRequests.filter((request) =>
    request.requestID.toString().includes(searchQuery)
  );

  const handleStatusChange = (id, newStatus) => {
    setRefundRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.requestID === id ? { ...request, returnStatus: newStatus } : request
      )
    );
  };

  const handleAuthorizePayment = (id) => {
    if (window.confirm('Are you sure you want to authorize the payment?')) {
      alert('Payment Authorized!');
    }
  };

  const handleDoRefund = (id) => {
    setRefundRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.requestID === id ? { ...request, returnStatus: 'Refund Done' } : request
      )
    );
  };

  return (
    <div className="refund-cards">
      {filteredRequests.map((request) => (
        <div key={request.requestID} className="refund-card">
          <div className="refund-header">
            <h3>Request ID: {request.requestID}</h3>
            <select
              value={request.returnStatus}
              onChange={(e) => handleStatusChange(request.requestID, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="refund-body">
            <p><strong>Reason:</strong> {request.reason}</p>
            <p><strong>Order ID:</strong> {request.orderID}</p>
            <p><strong>Product ID:</strong> {request.productID}</p>
            <p><strong>Quantity:</strong> {request.quantity}</p>
            <p><strong>Customer ID:</strong> {request.customerID}</p>
          </div>
          <div className="refund-actions">
            <button onClick={() => handleAuthorizePayment(request.requestID)}>Authorize Payment</button>
            <button onClick={() => handleDoRefund(request.requestID)}>Do Refund</button>
          </div>
          {request.returnStatus === 'Refund Done' && (
            <div className="refund-status">
              <p>Refund Done</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Refund;
