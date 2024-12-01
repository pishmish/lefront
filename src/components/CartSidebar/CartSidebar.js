import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';
import { fetchCart, addProductToCart, removeProductFromCart } from '../../api/cartapi';
import { getProductImage } from '../../api/storeapi';

const CartSidebar = ({ isOpen, onClose, customerID }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCartProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCart(customerID);
      console.log("response: ", response.data);
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

  useEffect(() => {
    if (isOpen) {
      loadCartProducts();
    }
  }, [isOpen]);

  const handleAddProduct = async (productID) => {
    try {
      await addProductToCart(productID);
      // Update cart items and total directly
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productID === productID ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      setTotal((prevTotal) =>
        prevTotal + parseFloat(cartItems.find((item) => item.productID === productID).unitPrice)
      );
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  const handleRemoveProduct = async (productID) => {
    try {
      await removeProductFromCart(productID, customerID);
      // Update cart items and total directly
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productID === productID ? { ...item, quantity: item.quantity - 1 } : item
        ).filter((item) => item.quantity > 0)
      );
      setTotal((prevTotal) =>
        prevTotal - parseFloat(cartItems.find((item) => item.productID === productID).unitPrice)
      );
    } catch (err) {
      console.error('Error removing product from cart:', err);
    }
  };

  const handlePayment = () => {
    onClose();
    navigate('/payment');
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty. Start shopping now!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productID} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${parseFloat(item.unitPrice).toFixed(2)}</p>
                <div className="cart-item-controls">
                  <button className="quantity-button" onClick={() => handleRemoveProduct(item.productID)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-button" onClick={() => handleAddProduct(item.productID)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-total">
        Total: ${total.toFixed(2)}
      </div>
      <button className="pay-now-button" onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default CartSidebar;
