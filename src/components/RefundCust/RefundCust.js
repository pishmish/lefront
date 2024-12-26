import React, { useState, useEffect } from 'react';
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

  // Fetch past refund requests from API
  useEffect(() => {
    const fetchPastRequests = async () => {
      try {
        const username = 'cem'; // Replace 'cem' with the actual username if dynamic
        const response = await fetch(`http://localhost:5001/returns/request/customer/${username}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPastRequests(data.requests); // Store the past refund requests
      } catch (error) {
        console.error('Error fetching past requests:', error);
      }
    };

    fetchPastRequests();
  }, []); // Runs once on component mount

  // Handle delete request
  const handleDeleteRequest = async (requestID) => {
    try {
      const response = await fetch(`http://localhost:5001/returns/request/${requestID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status === 200) {
        alert('Request deleted successfully!');
        setPastRequests(pastRequests.filter(request => request.requestID !== requestID)); // Remove deleted request from state
      } else {
        alert(`Error deleting request: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request.');
    }
  };

  // Define the fetchOrderDetails function
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

  useEffect(() => {
    fetchOrderDetails(); // Call fetchOrderDetails when selectedOrder changes
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

  const handleDelete = async (productID) => {
    try {
      const response = await fetch(`http://localhost:5001/order/orderitems/${selectedOrder.orderID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          products: [
            { productID } // Just sending the productID to delete the product
          ]
        }),
      });

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
        const response = await fetch('http://localhost:5001/returns/newrequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productID: item.productID,
            quantity: item.quantity,
            reason: reasons[item.productID], // Get the reason for each product
            orderID: selectedOrder.orderID,
          }),
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
                {request.returnStatus !== 'completed' && (
                  <button onClick={() => handleDeleteRequest(request.requestID)}>
                    Delete
                  </button>
                )}
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
                  <button onClick={() => handleDelete(item.productID)}>
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
            <button onClick={handleSubmit}>Submit Refund Request</button>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundCust;
