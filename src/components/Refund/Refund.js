import React, { useState, useEffect } from 'react';
import './Refund.css';

const Refund = ({ searchQuery }) => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundCosts, setRefundCosts] = useState({});
  const [activeFilter, setActiveFilter] = useState(true); // Track active status checkbox
  const [completedFilter, setCompletedFilter] = useState(true); // Track completed status checkbox
  const [expandedOrderID, setExpandedOrderID] = useState(null); // Track which order ID is expanded in accordion

  // API'den verileri çek
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await fetch('http://localhost:5001/returns/all', {
          method: 'GET',
          credentials: 'include',
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
  const filteredRequests = refundRequests.filter((request) => {
    // Eğer Active checkbox seçildiyse, active olanları göster
    const isActive = activeFilter && request.returnStatus !== 'completed';
    const isCompleted = completedFilter && request.returnStatus === 'completed';
    return isActive || isCompleted;
  }).filter((request) =>
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

  // İade işlemi
  const handleDoRefund = async (id) => {
    if (window.confirm('Are you sure you want to process the refund?')) {
      try {
        const response = await fetch(`http://localhost:5001/payment/refund/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to process refund');
        }

        // İade başarılı olduğunda maliyeti al
        const costResponse = await fetch(`http://localhost:5001/returns/request/${id}/cost`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!costResponse.ok) {
          throw new Error('Failed to fetch cost of refund');
        }

        const costData = await costResponse.json();

        // Refund Done statüsünü ve maliyeti güncelle
        setRefundRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.requestID === id ? { ...request, returnStatus: 'completed' } : request
          )
        );
        setRefundCosts((prevCosts) => ({ ...prevCosts, [id]: costData.cost }));

        alert('Refund processed successfully!');
      } catch (err) {
        alert(`Error processing refund: ${err.message}`);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (value === 'active') {
      setActiveFilter(checked);
    } else if (value === 'completed') {
      setCompletedFilter(checked);
    }
  };

  const toggleAccordion = (orderID) => {
    setExpandedOrderID(expandedOrderID === orderID ? null : orderID);
  };

  // Group requests by orderID
  const groupedRequests = filteredRequests.reduce((acc, request) => {
    if (!acc[request.orderID]) {
      acc[request.orderID] = [];
    }
    acc[request.orderID].push(request);
    return acc;
  }, {});

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="refund-container">
      <div className="status-filter">
        <label> </label>
        <input
          type="checkbox"
          id="active"
          value="active"
          checked={activeFilter}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="active" style={{ marginRight: '20px' }}>⏳</label>
        <input
          type="checkbox"
          id="completed"
          value="completed"
          checked={completedFilter}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="completed">👍</label>
      </div>

      {Object.keys(groupedRequests).map((orderID) => (
        <div key={orderID} className="accordion">
          <button className="accordion-header" onClick={() => toggleAccordion(orderID)}>
            Order ID: {orderID}
          </button>
          {expandedOrderID === orderID && (
            <div className="accordion-body">
              {groupedRequests[orderID].map((request) => (
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
                  {request.returnStatus === 'completed' && (
                    <div className="refund-status">
                      <p>Refund Done</p>
                      <p>Cost of Refund: {refundCosts[request.requestID]?.toFixed(2)} USD</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Refund;
