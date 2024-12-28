import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { fetchUserOrders, fetchOrder, deleteOrderItems } from '../../api/orderapi';
import { getCustomerReturnRequests, deleteReturnRequest, createReturnRequest } from '../../api/returnsapi';
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
        console.log('username:', username);
      const response = await getCustomerReturnRequests(username);
      console.log('response:', response.data);
      setPastRequests(response.data.requests || []); // Ensure we set array even if empty
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
      const response = await deleteOrderItems(selectedOrder.orderID, productID);

      const data = await response.json();
      if (response.status === 200) {
        alert('Product deleted successfully!');
        setOrderDetails(null);
        setRefundItems([]);
        await fetchOrderDetails(); // Fetch the updated order details
      } else {
        alert(`Error deleting product: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  const handleReasonChange = (e, productID) => {
    setReasons({
      ...reasons,
      [productID]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (refundItems.length === 0 || Object.values(reasons).some(reason => !reason)) {
      alert('Please specify quantity and reason for the return.');
      return;
    }

    try {
      let refundSuccess = true; // Variable to track if all refund requests succeed

      for (let item of refundItems) {
        const response = await createReturnRequest({  
          orderID: selectedOrder.orderID,
          productID: item.productID,
          quantity: item.quantity,
          reason: reasons[item.productID]
        });

        const data = await response.json();

        if (response.status < 200 || response.status >= 300) {
          refundSuccess = false;
          alert(`Error: ${data.message || 'An error occurred.'}`);
          break; // Stop the loop if an error occurs
        }
      }

      if (refundSuccess) {
        alert('Refund request submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Error submitting refund request.');
    }

    // Reset state after submission
    setSelectedOrder(null);
    setOrderDetails(null);
    setRefundItems([]);
    setReasons({});
  };

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
                    <p>Status: {request.returnStatus === 'received' ? 'Pending' : request.returnStatus}</p>
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
                  </div>
                  {request.returnStatus !== 'completed' && (
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
                  <p>Estimated Arrival: {new Date(order.estimatedArrival).toLocaleString()}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {orderDetails && selectedOrder && (
        <div className="order-details">
          <h2>Order Details for Order {selectedOrder.orderID}</h2>
          {orderDetails.orderItems && orderDetails.orderItems.map((item) => (
            <div key={item.productID} className="order-item-detail">
              <div className="product-info">
                <p className="product-name">{item.productName}</p>
                <p className="product-quantity">
                  Available Quantity: {item.quantity}
                </p>
              </div>
              {selectedOrder.deliveryStatus === 'Processing' && (
                <div className="delete-item">
                  <button className="refundButton" onClick={() => handleDelete(item.productID)}>
                    Delete
                  </button>
                </div>
              )}
              {selectedOrder.deliveryStatus === 'Delivered' && (
                <div className="return-quantity">
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    placeholder="Enter quantity"
                    onChange={(e) =>
                      handleQuantityChange(e, item.productID, item.quantity)
                    }
                  />
                  <textarea
                    placeholder="Reason for return"
                    value={reasons[item.productID] || ''}
                    onChange={(e) => handleReasonChange(e, item.productID)}
                  ></textarea>
                </div>
              )}
            </div>
          ))}
          {selectedOrder.deliveryStatus === 'Delivered' && (
            <button className="refundButton" onClick={handleSubmit}>Submit Refund Request</button>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundCust;
