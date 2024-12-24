import React, { useState, useEffect } from 'react';
import './RefundCust.css';

const RefundCust = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundItems, setRefundItems] = useState([]);
  const [reason, setReason] = useState('');

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

  const [pastAccordionOpen, setPastAccordionOpen] = useState(false);
  const [orderAccordionOpen, setOrderAccordionOpen] = useState(false);

  // Fetch orders data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/order/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOrders(data); // Store the fetched orders in the state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch order details when an order is selected
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (selectedOrder) {
        try {
          const response = await fetch(`http://localhost:5001/order/getorder/${selectedOrder.orderID}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setOrderDetails(data); // Store the order details in the state
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      }
    };

    fetchOrderDetails();
  }, [selectedOrder]);

  const handleOrderSelect = (order) => {
    if (selectedOrder?.orderID === order.orderID) {
      setSelectedOrder(null);
      setOrderDetails(null);
      setRefundItems([]);
    } else {
      setSelectedOrder(order);
      setRefundItems([]);
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

  const handleSubmit = async () => {
    // Prepare the refund request data
    if (refundItems.length === 0 || !reason) {
      alert('Please specify quantity and reason for the return.');
      return;
    }
  
    try {
      let refundSuccess = true; // Variable to track if all refund requests succeed
  
      for (let item of refundItems) {
        const response = await fetch('http://localhost:5001/returns/newrequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productID: item.productID,
            quantity: item.quantity,
            reason,
            orderID: selectedOrder.orderID,
          }),
        });
  
        // Log the HTTP status and response body to check for server-side issues
        console.log('Response Status:', response.status);
        const data = await response.json();
        console.log('Refund Request Response:', data);
  
        // Check if any of the requests fail
        if (response.status < 200 || response.status >= 300) {
          refundSuccess = false;
          alert(`Error: ${data.message || 'An error occurred.'}`);
          break; // Stop the loop if an error occurs
        }
      }
  
      // Only show the success message if all requests were successful
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
    setReason('');
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
            {pastRequests.map((request) => (
              <div key={request.requestID} className="refund-card">
                <div className="refund-header">
                  <h3>Request ID: {request.requestID}</h3>
                  <p>Status: {request.returnStatus}</p>
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion for Your Orders */}
      <div className="orders-list">
        <div
          className="accordion-header"
          onClick={() => setOrderAccordionOpen(!orderAccordionOpen)}
        >
          <h2>Your Orders</h2>
        </div>
        {orderAccordionOpen && (
          <div className="accordion-body">
            {orders.map((order) => (
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
              </div>
            </div>
          ))}
          <textarea
            placeholder="Reason for return"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <button onClick={handleSubmit}>Submit Refund Request</button>
        </div>
      )}
    </div>
  );
};

export default RefundCust;
