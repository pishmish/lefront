import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';
import { fetchUserOrders, fetchOrder, deleteOrderItem } from '../../api/orderapi';
import { getCustomerReturnRequests, deleteReturnRequest, createReturnRequest, getReturnCost } from '../../api/returnsapi';
import './RefundCust.css';

const RefundCust = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [reasons, setReasons] = useState({}); // To store reasons per product
  const [pastRequests, setPastRequests] = useState([]); // State to store past requests
  const [pastAccordionOpen, setPastAccordionOpen] = useState(false);
  const [orderAccordionOpen, setOrderAccordionOpen] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // Add new state for submit error
  const errorTimerRef = useRef(null); // Add timer ref at the top of component
  const [expandedProducts, setExpandedProducts] = useState({}); // Add new state at the top of the component after other state declarations
  const [refundCosts, setRefundCosts] = useState({}); // Add to state declarations at top

  // Add helper function at the top of the component
  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'approved': 'Awaiting Product',
      'productReceived': 'Processing Refund',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  };

  // Fetch orders data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchUserOrders();
        setOrders(response.data); // Store the fetched orders in the state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch past refund requests from API
  useEffect(() => {
    fetchRequests();
  }, []); // Runs once on component mount

  const fetchRequests = async () => {
    try {
      const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='));
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const decodedToken = jwtDecode(token.split('=')[1]);
        const username = decodedToken.id;
        if (!username) {
          throw new Error('Username not found in token');
        }
      const response = await getCustomerReturnRequests(username);
      
      setPastRequests(response.data.requests || []); // Ensure we set array even if empty
      console.log('Past requests:', response.data.requests);
    } catch (err) {
      setError(err.message);
      setPastRequests([]); // Reset to empty array on error
    }
  };

  // Handle delete request
  const handleDeleteRequest = async (requestID) => {
    try {
      await deleteReturnRequest(requestID);
      await fetchRequests(); // Refresh list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  // Define the fetchOrderDetails function
  const fetchOrderDetails = async () => {
    if (selectedOrder) {
      try {
        const response = await fetchOrder(selectedOrder.orderID);
        setOrderDetails(response.data); // Store the order details in the state
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrderDetails(); // Call fetchOrderDetails when selectedOrder changes
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      // When an order is selected, ensure the order details are visible
      setOrderAccordionOpen(false); // Close orders list
    }
  }, [selectedOrder]);

  const handleOrderSelect = (order) => {
    if (selectedOrder?.orderID === order.orderID) {
      // If clicking the same order again, collapse everything
      setSelectedOrder(null);
      setOrderDetails(null);
      setRefundItems([]);
    } else {
      // When selecting a new order, close the orders accordion and show details
      setSelectedOrder(order);
      setRefundItems([]);
      setOrderAccordionOpen(false); // Close the orders list accordion
    }
  };

  const handleQuantityChange = (e, productID, availableQuantity) => {
    const quantity = parseInt(e.target.value, 10);

    // Limit quantity input to the available quantity in the order
    if (quantity <= availableQuantity) {
      setRefundItems((prevItems) => [
        ...prevItems.filter((i) => i.productID !== productID),
        { productID, quantity },
      ]);
    }
  };

  const handleDelete = async (productID) => {
    try {
      const response = await deleteOrderItem(selectedOrder.orderID, productID);
      console.log('Delete response:', response);
      
      if (response.status === 200) {
        alert('Product deleted successfully!');
        setOrderDetails(null);
        setRefundItems([]);
        await fetchOrderDetails();
      } else {
        // Extract error message from response
        const errorMessage = response.data?.msg || response.msg || 'Unknown error occurred';
        alert(`Error deleting product: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Error deleting product';
      alert(errorMessage);
    }
  };

  const handleReasonChange = (e, productID) => {
    setReasons({
      ...reasons,
      [productID]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Clear any existing error and timer
    setSubmitError(null);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    if (refundItems.length === 0 || Object.values(reasons).some(reason => !reason)) {
      alert('Please specify quantity and reason for the return.');
      return;
    }

    try {
      setSubmitError(null);
      let refundSuccess = true;

      for (let item of refundItems) {
        try {
          const response = await createReturnRequest({
            orderID: selectedOrder.orderID,
            productID: item.productID,
            quantity: item.quantity,
            reason: reasons[item.productID]
          });
          
          // Log full response for debugging
          console.log('Full response:', response);
          
          if (response.data?.msg === 'Order exceeds 30 days') {
            setSubmitError('This order cannot be refunded as it is more than 30 days old.');
            refundSuccess = false;
            break;
          }
        } catch (error) {
          console.log('Full error object:', error);
          console.log('Error response:', error.response);
          
          // Extract error message from response
          const errorMessage = error.response?.data?.msg || error.message;
          setSubmitError(errorMessage);
          console.error('Error details:', {
            message: errorMessage,
            status: error.response?.status,
            statusText: error.response?.statusText
          });
          refundSuccess = false;
          break;
        }
      }

      if (refundSuccess) {
        await fetchRequests(); // Add this line to reload requests
        alert('Refund request submitted successfully!');
        setSelectedOrder(null);
        setOrderDetails(null);
        setRefundItems([]);
        setReasons({});
        setSubmitError(null);
      }
    } catch (error) {
      console.error('Outer try-catch error:', error);
      setSubmitError('Error submitting refund request. Please try again later.');
    }
  };

  // Add useEffect to handle error timeout
  useEffect(() => {
    if (submitError) {
      // Clear any existing timer
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      
      // Set new 5-second timer
      errorTimerRef.current = setTimeout(() => {
        setSubmitError(null);
      }, 5  * 1000); // 5 seconds in milliseconds
    }

    // Cleanup on unmount
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [submitError]);

  // Add new handler after other handlers
  const toggleProductExpand = (productID) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productID]: !prev[productID]
    }));
  };

  // Add new useEffect after other useEffects
  useEffect(() => {
    const fetchAllCosts = async () => {
      const costs = {};
      if (Array.isArray(pastRequests)) {
        for (const request of pastRequests) {
          if (request.returnStatus === 'completed' || 
              request.returnStatus === 'productReceived') {
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
      }
      setRefundCosts(costs);
    };

    if (pastRequests.length > 0) {
      fetchAllCosts();
    }
  }, [pastRequests]);

  return (
    <div className="refund-cust">
      {/* Accordion for Past Refund Requests */}
      <div className="past-requests">
        <div
          className="accordion-header"
          onClick={() => setPastAccordionOpen(!pastAccordionOpen)}
        >
          <h2>Past Refund Requests</h2>
        </div>
        {pastAccordionOpen && (
          <div className="accordion-body">
            {error && <div className="error-message">{error}</div>}
      
            {Array.isArray(pastRequests) && pastRequests.length > 0 ? (
              pastRequests.map(request => (
                <div key={request.requestID} className="refund-card">
                  <div className="refund-header">
                    <h3>Request ID: {request.requestID}</h3>
                    <div className={`status-badge ${request.returnStatus}`}>
                      {getStatusDisplay(request.returnStatus)}
                    </div>
                  </div>
                  <div className="refund-body">
                    <p>
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p>
                      <strong>Order ID:</strong> {request.orderID}
                    </p>
                    <p>
                      <strong>Product ID:</strong> {request.productID}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {request.quantity}
                    </p>
                    <p>
                      <strong>Refund Amount:</strong> {
                        request.returnStatus === 'completed' || request.returnStatus === 'productReceived' || request.returnStatus === 'pending' 
                          ? `$${refundCosts[request.requestID] || '0.00'}`
                          : 'Pending'
                      }
                    </p>
                  </div>
                  {request.returnStatus === 'pending' && (
                    <button className="refundButton" onClick={() => handleDeleteRequest(request.requestID)}>
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No refund requests found.</p>
            )}
          </div>
        )}
      </div>

      <div className="orders-list">
        <div
          className="accordion-header"
          onClick={() => setOrderAccordionOpen(!orderAccordionOpen)}
        >
          <h2>Your Orders</h2>
        </div>
        {orderAccordionOpen && (
          <div className="accordion-body">
            {orders
              .filter((order) => order.totalPrice !== '0.00') // Filter out orders with totalPrice 0.00
              .map((order) => (
                <div
                  key={order.orderID}
                  className={`order-item ${
                    selectedOrder?.orderID === order.orderID ? 'selected' : ''
                  }`}
                  onClick={() => handleOrderSelect(order)}
                >
                  <p>Order ID: {order.orderID}</p>
                  <p>Total Price: ${order.totalPrice}</p>
                  <p>Status: {order.deliveryStatus}</p>
                  <p>Date Ordered: {new Date(order.timeOrdered).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {orderDetails && selectedOrder && (
        <div className="order-details">
          <h2>Order Details for Order {selectedOrder.orderID}</h2>
          {submitError && (
            <div className="error-message">
              {submitError}
            </div>
          )}
          {orderDetails.orderItems && orderDetails.orderItems.map((item) => (
            <div key={item.productID} className="product-card">
              <div 
                className="product-header"
                onClick={() => toggleProductExpand(item.productID)}
              >
                <div>
                  <span className="product-name">{item.productName}</span>
                  <span className="product-quantity"> (Qty: {item.quantity})</span>
                </div>
                <span>{expandedProducts[item.productID] ? '▼' : '▶'}</span>
              </div>
              
              {expandedProducts[item.productID] && (
                <div className="product-refund-form">
                  {selectedOrder.deliveryStatus === 'Processing' ? (
                    <button 
                      className="refundButton" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.productID);
                      }}
                    >
                      Delete
                    </button>
                  ) : selectedOrder.deliveryStatus === 'Delivered' && (
                    <>
                      <div className="quantity-input">
                        <label>Return Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          placeholder="Quantity"
                          onChange={(e) => handleQuantityChange(e, item.productID, item.quantity)}
                        />
                      </div>
                      <div className="reason-input">
                        <label>Reason for Return:</label>
                        <textarea
                          placeholder="Please provide a reason for return"
                          value={reasons[item.productID] || ''}
                          onChange={(e) => handleReasonChange(e, item.productID)}
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {selectedOrder.deliveryStatus === 'Delivered' && (
            <button className="refundButton" onClick={handleSubmit}>
              Submit Refund Request
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundCust;
