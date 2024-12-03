import React, { useState, useEffect } from 'react';
import './PaymentPage.css';
import { fetchCart } from '../../api/cartapi';
import { useNavigate } from 'react-router-dom';
import { getProductImage } from '../../api/storeapi';
import {jwtDecode} from 'jwt-decode'; // Doğru kütüphane import edildi
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerID, setCustomerID] = useState(null);

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const loadCartProducts = async () => {
    setLoading(true);
    setError(null);

    const checkAuth = () => {
      const token = document.cookie.split('; ').find((row) => row.startsWith('authToken='));
      if (!token) {
        setCustomerID(null);
        return;
      }
      const decodedToken = jwtDecode(token.split('=')[1]);
      setCustomerID(decodedToken.customerID);
    };

    checkAuth();

    try {
      const response = await fetchCart(customerID);
      const cartData = response.data;

      if (cartData && cartData.products && cartData.products.length > 0) {
        const productsWithImages = await Promise.all(
          cartData.products.map(async (product) => {
            try {
              const imageResponse = await getProductImage(product.productID);
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...product, imageUrl };
            } catch (err) {
              console.error(`Error fetching image for product ${product.productID}:`, err);
              return { ...product, imageUrl: '/assets/images/default.jpg' };
            }
          })
        );

        setCartItems(productsWithImages);
        const calculatedTotal = productsWithImages.reduce(
          (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
          0
        );
        setTotal(calculatedTotal);
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error fetching cart data:', err);
      setError('Failed to load cart data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/payment/process', {
        creditCard: paymentInfo,
      },{withCredentials:true});

      if (response.status === 200) {
        alert('Payment processed successfully!');
        
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Failed to process payment. Please try again.');
    }
  };

  useEffect(() => {
    loadCartProducts();
  }, []);

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Sol Taraf: Adres ve Kart Bilgileri */}
        <div className="payment-form-section">
          <h2>Billing Details</h2>
          <form className="billing-form" onSubmit={handlePaymentSubmit}>
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
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Complete Payment
            </button>
          </form>
        </div>

        {/* Sağ Taraf: Sepet Ürünleri */}
        <div className="cart-summary-section">
          <h2>Your Order</h2>
          <div className="cart-items">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.productID} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${parseFloat(item.unitPrice).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
