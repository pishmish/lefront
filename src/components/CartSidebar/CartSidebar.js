// CartSidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Mock cart items with images
  const cartItems = [
    {
      id: 1,
      name: 'Elegant Tote Bag',
      price: 75,
      quantity: 1,
      imageUrl: '/assets/images/tote-bag.jpg',
    },
    {
      id: 2,
      name: 'Casual Backpack',
      price: 120,
      quantity: 2,
      imageUrl: '/assets/images/backpack.jpg',
    },
  ];

  const handlePayment = () => {
    onClose(); // Sidebar'ı kapat
    navigate('/payment'); // PaymentPage'e yönlendir
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>
      </div>
      <button className="pay-now-button" onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default CartSidebar;
