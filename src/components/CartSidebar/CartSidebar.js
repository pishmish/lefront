import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './CartSidebar.css';
import { fetchCart, addProductToCart, removeProductFromCart } from '../../api/cartapi';
import { getProductImage } from '../../api/storeapi';
import emptyCartImage from '../../assets/images/empty-cart.jpg'; // Import the image

const CartSidebar = ({ isOpen, onClose, customerID, onCartUpdate }) => {
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

  // Listen for the 'CART_UPDATED' event to refresh cart data
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isOpen) {
        loadCartProducts();
      }
    };

    window.addEventListener('CART_UPDATED', handleCartUpdate);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('CART_UPDATED', handleCartUpdate);
    };
  }, [isOpen]); // Re-run the effect if 'isOpen' changes

  const handleAddProduct = async (productID) => {
    try {
      await addProductToCart(productID, customerID);
      // Update cart items and total directly
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productID === productID ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      setTotal((prevTotal) =>
        prevTotal + parseFloat(cartItems.find((item) => item.productID === productID).unitPrice)
      );
      onCartUpdate(); // Notify Navbar to update the cart item count

      // Optionally, dispatch 'CART_UPDATED' to notify other components
      const event = new Event('CART_UPDATED');
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  const handleRemoveProduct = async (productID) => {
    try {
      await removeProductFromCart(productID, customerID);
      // Update cart items and total directly
      setCartItems((prevItems) =>
        prevItems
          .map((item) =>
            item.productID === productID ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
      setTotal((prevTotal) =>
        prevTotal - parseFloat(cartItems.find((item) => item.productID === productID).unitPrice)
      );
      onCartUpdate(); // Notify Navbar to update the cart item count

      // Optionally, dispatch 'CART_UPDATED' to notify other components
      const event = new Event('CART_UPDATED');
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error removing product from cart:', err);
    }
  };

  const handlePayment = () => {
    if (customerID) {
      onClose();
      navigate('/payment');
    } else {
      onClose();
      navigate('/login');
    }
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>

      {cartItems.length > 0 && <h2>Your Cart</h2>}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p1>Your cart is empty.</p1>
          <p2>Not sure where to start?</p2>
          <div className="category-buttons">
            <Link to="/category/Handbags">
              <button className="start-shopping-button">Shop Handbags</button>
            </Link>
            <Link to="/category/Backpacks">
              <button className="start-shopping-button">Shop Backpacks</button>
            </Link>
            <Link to="/category/Luggage">
              <button className="start-shopping-button">Shop Luggage</button>
            </Link>
            <Link to="/category/Travel%20Bags">
              <button className="start-shopping-button">Shop Travel Bags</button>
            </Link>
            <Link to="/category/Sports%20Bags">
              <button className="start-shopping-button">Shop Sports Bags</button>
            </Link>
          </div>
          <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
        </div>
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

      {cartItems.length > 0 && (
        <>
          <div className="cart-total">
            Total: ${total.toFixed(2)}
          </div>
          <button className="pay-now-button" onClick={handlePayment}>CONTINUE TO CHECKOUT</button>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
