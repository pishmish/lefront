// PaymentPage.js
import React from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
  // Mock cart items
  const cartItems = [
    { id: 1, name: 'Elegant Tote Bag', price: 75, quantity: 1, imageUrl: '/assets/images/tote-bag.jpg' },
    { id: 2, name: 'Casual Backpack', price: 120, quantity: 2, imageUrl: '/assets/images/backpack.jpg' },
  ];

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Sol Taraf: Adres ve Kart Bilgileri */}
        <div className="payment-form-section">
          <h2>Billing Details</h2>
          <form className="billing-form">
            {/* Adres Bilgileri */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" required />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" name="postalCode" required />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" required />
            </div>

            {/* Kart Bilgileri */}
            <h2>Payment Information</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" name="cardNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" name="cvv" required />
            </div>
            <button type="submit" className="submit-button">Complete Payment</button>
          </form>
        </div>

        {/* Sağ Taraf: Sepet Ürünleri */}
        <div className="cart-summary-section">
          <h2>Your Order</h2>
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
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
