import React, { useState, useEffect } from 'react';
import './Refund.css';

const Refund = ({ searchQuery }) => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den verileri çek
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await fetch('http://localhost:5001/returns/all', {
          method: 'GET',
          credentials: 'include', // Çerezlerin istekle birlikte gönderilmesini sağlar
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch refund requests');
        }
  
        const data = await response.json();
        setRefundRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchRefundRequests();
  }, []);
  

  // Filtreleme işlemi
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
