// components/OrderList/OrderList.js
import React from 'react';

const OrderList = () => {
  const orders = [
    { id: 1, productName: 'Elegant Tote Bag', customerName: 'John Doe', quantity: 2, date: '2023-08-15' },
    { id: 2, productName: 'Casual Backpack', customerName: 'Jane Smith', quantity: 1, date: '2023-08-16' },
  ];

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Product</th>
          <th>Customer</th>
          <th>Quantity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.productName}</td>
            <td>{order.customerName}</td>
            <td>{order.quantity}</td>
            <td>{order.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderList;
