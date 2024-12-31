import React, { useState, useEffect } from 'react';
import './PaymentPage.css';
import { processPayment, createOrder, mailInvoiceByIdtoEmail } from '../../api/orderapi'; // Import the API function
import { fetchCart } from '../../api/cartapi';
import { useNavigate } from 'react-router-dom';
import { getProductImage } from '../../api/storeapi';
import {jwtDecode} from 'jwt-decode'; // Doğru kütüphane import edildi
import axios from 'axios';
import { fetchUserProfile } from '../../api/userapi';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerID, setCustomerID] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [addressInfo, setAddressInfo] = useState({
    country: '',
    province: '',
    city: '',
    zipCode: '',
    streetAddress: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const loadCartProducts = async () => {
    setLoading(true);
    setError(null);

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
          (sum, item) => sum + parseFloat(item.unitPrice * (1 - item.discountPercentage/100)) * item.quantity,
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
    if (name in paymentInfo) {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    } else if (name in addressInfo) {
      setAddressInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process payment
      const response = await processPayment({ creditCard: paymentInfo });
      if (response.status !== 200) {
        setPaymentError('The payment information you entered is incorrect. Please try again.');
        return;
      }

      // Create the order
      const orderResponse = await createOrder({ address: addressInfo });
      if (orderResponse.status !== 200) {
        setPaymentError('Failed to create order. Please try again.');
        return;
      }

      const orderId = orderResponse.data.orderID;

      // Fetch user email and send the invoice
      const userProfile = await fetchUserProfile();
      const email = userProfile.data.user.email;

      if (email) {
        await mailInvoiceByIdtoEmail(orderId, email);
      } else {
        console.error('No email found for user');
      }

      navigate(`/invoice/${orderId}`);
      setPaymentError(null);
    } catch (err) {
      console.error('Error processing payment:', err);
      setPaymentError('An error occurred while processing your payment. Please try again.');
    }
  };

  useEffect(() => {
    // Check auth first
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
  }, []); // Run once when component mounts

  // Separate useEffect to react to customerID changes
  useEffect(() => {
    if (customerID) {
      loadCartProducts();
    }
  }, [customerID]);

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Sol Taraf: Adres ve Kart Bilgileri */}
        <div className="payment-form-section">
          <h2>DELIVERY ADDRESS</h2>
          <form className="billing-form" onSubmit={handlePaymentSubmit}>
            {/* Adres Bilgileri */}
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" value={addressInfo.country} onChange={handlePaymentChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="province">Province</label>
              <input type="text" id="province" name="province" value={addressInfo.province} onChange={handlePaymentChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={addressInfo.city} onChange={handlePaymentChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="streetAddress">Street Address</label>
              <input type="text" id="streetAddress" name="streetAddress" value={addressInfo.streetAddress} onChange={handlePaymentChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input type="text" id="zipCode" name="zipCode" value={addressInfo.zipCode} onChange={handlePaymentChange} required />
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
          {paymentError && <div className="error-message">{paymentError}</div>}
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
                  <div className="cart-item-image">
                    <img src={item.imageUrl} alt={item.name} />
                    {item.discountPercentage > 0 && (
                      <div className="cart-discount-badge">
                        -{item.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <div className="cart-price-container">
                      {item.discountPercentage > 0 ? (
                        <>
                          <p className="cart-original-price">${parseFloat(item.unitPrice).toFixed(2)}</p>
                          <p className="cart-discounted-price">
                            ${(parseFloat(item.unitPrice) * (1 - item.discountPercentage / 100)).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="cart-price">${parseFloat(item.unitPrice).toFixed(2)}</p>
                      )}
                    </div>
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
