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

  // Durum değişikliğini backend'e gönder
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/returns/request/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update status');
      }

      const updatedRequest = refundRequests.map((request) =>
        request.requestID === id ? { ...request, returnStatus: newStatus } : request
      );

      setRefundRequests(updatedRequest);
      alert('Status updated successfully!');
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Ödeme yetkilendirme işlemi
  const handleAuthorizePayment = async (id) => {
    if (window.confirm('Are you sure you want to authorize the payment?')) {
      try {
        const response = await fetch(`http://localhost:5001/returns/request/${id}/authorizepayment`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to authorize payment');
        }

        alert('Payment Authorized Successfully!');
      } catch (err) {
        alert(`Error authorizing payment: ${err.message}`);
      }
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
              <option value="accepted">Accepted</option>
              <option value="awaitingProduct">Awaiting Product</option>
              <option value="productReceived">Product Received</option>
            </select>
          </div>
          <div className="refund-body">
            <p><strong>Reason:</strong> {request.reason}</p>
            <p><strong>Status:</strong> {request.returnStatus}</p>
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
