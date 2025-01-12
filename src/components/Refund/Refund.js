import React, { useState, useEffect } from 'react';
import { getAllReturns, sendRefundApprovalEmail, authorizeReturnPayment, refundPayment, getReturnCost, getRefundRequestStatus, updateReturnRequestStatus } from '../../api/returnsapi';
import './Refund.css';

const Refund = ({ searchQuery }) => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundCosts, setRefundCosts] = useState({});
  const [activeFilter, setActiveFilter] = useState(true); // Track active status checkbox
  const [completedFilter, setCompletedFilter] = useState(false); // Track completed status checkbox
  const [expandedOrderID, setExpandedOrderID] = useState(null); // Track which order ID is expanded in accordion
  const [refundStatuses, setRefundStatuses] = useState({}); // Add new state for refund statuses
  const [refundAmounts, setRefundAmounts] = useState({}); // Add to state declarations at top

  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await getAllReturns();
        if (response === 200) {
          throw new Error('Failed to fetch refund requests');
        }

        setRefundRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  useEffect(() => {
    const fetchRefundStatuses = async () => {
      const statuses = {};
      for (const request of refundRequests) {
        try {
          const response = await getRefundRequestStatus(request.requestID);
          if (response.status === 200 && response.data.length > 0) {
            // Access the approvalStatus from the first result
            statuses[request.requestID] = response.data[0].approvalStatus;
          } else {
            statuses[request.requestID] = 'pending';
          }
        } catch (err) {
          console.error(`Error fetching refund status for ${request.requestID}:`, err);
          statuses[request.requestID] = 'pending';
        }
      }
      setRefundStatuses(statuses);
    };

    if (refundRequests.length > 0) {
      fetchRefundStatuses();
    }
  }, [refundRequests]);

  // Add useEffect to fetch costs for all requests
  useEffect(() => {
    const fetchAllCosts = async () => {
      const costs = {};
      for (const request of refundRequests) {
        if (request.returnStatus === 'completed' || request.returnStatus === 'productReceived' || refundStatuses[request.requestID] === 'authorized') {
          try {
            const costResponse = await getReturnCost(request.requestID);
            if (costResponse.status === 200) {
              costs[request.requestID] = costResponse.data.cost;
            }
          } catch (err) {
            console.error(`Error fetching cost for request ${request.requestID}:`, err);
          }
        }
      }
      setRefundCosts(costs);
    };

    if (refundRequests.length > 0) {
      fetchAllCosts();
    }
  }, [refundRequests]);

  const filteredRequests = refundRequests.filter((request) => {
    const isActive = activeFilter && request.returnStatus !== 'completed' && request.returnStatus !== 'rejected';
    const isCompleted = completedFilter && (request.returnStatus === 'completed' || request.returnStatus === 'rejected');
    return isActive || isCompleted;
  }).filter((request) =>
    request.requestID.toString().includes(searchQuery)
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateReturnRequestStatus(id, newStatus);
      
      if (!response || response.status !== 200) {
        throw new Error(response.msg || 'Failed to update status');
      }

      // Fetch refund amount when status changes to productReceived
      if (newStatus === 'productReceived') {
        const costResponse = await getReturnCost(id);
        if (costResponse.status === 200) {
          setRefundCosts(prev => ({
            ...prev,
            [id]: costResponse.data.cost
          }));
        }
        
        setRefundStatuses(prev => ({
          ...prev,
          [id]: 'pending'
        }));
      }

      setRefundRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requestID === id ? { ...request, returnStatus: newStatus } : request
        )
      );

      alert('Status updated successfully!');
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAuthorizePayment = async (id) => {
    if (window.confirm('Are you sure you want to authorize the payment?')) {
      try {
        const response = await authorizeReturnPayment(id);
        if (response.status !== 200) {
          throw new Error(response.msg || 'Failed to authorize payment');
        }

        await sendRefundApprovalEmail(id);
        
        const statusResponse = await getRefundRequestStatus(id);
        if (statusResponse.status === 200 && statusResponse.data.length > 0) {
          setRefundStatuses(prev => ({
            ...prev,
            [id]: statusResponse.data[0].approvalStatus
          }));
        }
        
        alert('Payment Authorized Successfully!');
      } catch (err) {
        alert(`Error authorizing payment: ${err.message}`);
      }
    }
  };

  const handleDoRefund = async (id) => {
    if (window.confirm('Are you sure you want to process the refund?')) {
      try {
        const response = await refundPayment(id);

        if (response.status !== 200) {
          throw new Error(response.msg || 'Failed to process refund');
        }

        const costResponse = await getReturnCost(id);

        if (costResponse.status !== 200) {
          throw new Error('Failed to fetch cost of refund');
        }

        setRefundRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.requestID === id ? { ...request, returnStatus: 'completed' } : request
          )
        );
        setRefundCosts((prevCosts) => ({ ...prevCosts, [id]: costResponse.data.cost }));

        alert('Refund processed successfully!');
      } catch (err) {
        alert(`Error processing refund: ${err.message}`);
      }
    }
  };

  // Add handleReject function after handleDoRefund
  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await updateReturnRequestStatus(id, 'rejected');
        
        setRefundRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.requestID === id ? { ...request, returnStatus: 'rejected' } : request
          )
        );
        
        setRefundStatuses(prev => ({
          ...prev,
          [id]: 'rejected'
        }));

        alert('Request rejected successfully');
      } catch (err) {
        alert(`Error rejecting request: ${err.message}`);
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
        <label>
          <input
            type="checkbox"
            id="active"
            value="active"
            checked={activeFilter}
            onChange={handleCheckboxChange}
          />
          Active Requests
        </label>
        <label>
          <input
            type="checkbox"
            id="completed"
            value="completed"
            checked={completedFilter}
            onChange={handleCheckboxChange}
          />
          Completed
        </label>
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
                    {request.returnStatus === 'completed' || request.returnStatus === 'rejected' ? (
                      <div className={`status-badge ${request.returnStatus}`}>
                        {request.returnStatus === 'rejected' ? 'Rejected' : 'Completed'}
                      </div>
                    ) : (
                      <div className={`status-badge ${request.returnStatus}`}>
                        {request.returnStatus === 'pending' ? 'Pending' : 
                         request.returnStatus === 'approved' ? 'Approved' : 
                         request.returnStatus === 'productReceived' ? 'Product Received' : 
                         request.returnStatus}
                      </div>
                    )}
                  </div>
                  <div className="refund-body">
                    <p><strong>Reason:</strong> {request.reason}</p>
                    <p><strong>Order ID:</strong> {request.orderID}</p>
                    <p><strong>Product ID:</strong> {request.productID}</p>
                    <p><strong>Quantity:</strong> {request.quantity}</p>
                    <p><strong>Customer ID:</strong> {request.customerID}</p>
                  </div>
                  <div className="refund-actions">
                    {request.returnStatus === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(request.requestID, 'approved')}
                          className="accept-button"
                        >
                          Accept Request
                        </button>
                        <button 
                          onClick={() => handleReject(request.requestID)}
                          className="reject-button"
                        >
                          Reject Request
                        </button>
                      </>
                    )}

                    {request.returnStatus === 'approved' && (
                      <button 
                        onClick={() => handleStatusChange(request.requestID, 'productReceived')}
                        className="product-received-button"
                      >
                        Product Received
                      </button>
                    )}

                    {(request.returnStatus === 'completed' || request.returnStatus === 'rejected' || request.returnStatus === 'productReceived' || refundStatuses[request.requestID] !== 'pending') && (
                      <div className="refund-status-log">
                        <p>Refund Status: {
                          request.returnStatus === 'rejected' 
                            ? 'Rejected' 
                            : refundStatuses[request.requestID] || 'pending'
                        }</p>
                      </div>
                    )}

                    {request.returnStatus === 'productReceived' && refundStatuses[request.requestID] === 'pending' && (
                      <button 
                        onClick={() => handleAuthorizePayment(request.requestID)}
                        className="authorize-button"
                      >
                        Authorize Payment
                      </button>
                    )}

                    {refundStatuses[request.requestID] === 'authorized' && (
                      <button 
                        onClick={() => handleDoRefund(request.requestID)}
                        className="refund-button"
                      >
                        Do Refund
                      </button>
                    )}
                  </div>
                  {(request.returnStatus === 'productReceived' || 
                    refundStatuses[request.requestID] === 'authorized' || 
                    request.returnStatus === 'completed') && (
                    <div className="refund-cost">
                      <p><strong>Refund Amount:</strong> ${refundCosts[request.requestID] || '0.00'}</p>
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
