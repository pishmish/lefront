import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './CartSidebar.css';
import { fetchCart, addProductToCart, removeProductFromCart, deleteProductFromCart } from '../../api/cartapi';
import { getProductImage, fetchProductById } from '../../api/storeapi'; // Import fetchProductById
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
      const cartData = response.data;

      if (cartData && cartData.products && cartData.products.length > 0) {
        const productsWithImages = await Promise.all(
          cartData.products.map(async (product) => {
            try {
              const imageResponse = await getProductImage(product.productID);
              const imageUrl = URL.createObjectURL(imageResponse.data);
              // Fetch product stock information
              const productResponse = await fetchProductById(product.productID);
              const stock = productResponse.data[0].stock;
              return { ...product, imageUrl, stock };
            } catch (err) {
              console.error(`Error fetching data for product ${product.productID}:`, err);
              return { ...product, imageUrl: '/assets/images/default.jpg', stock: 0 };
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

  // Utility function to dispatch the custom event
  const dispatchProductQuantityUpdate = (productID, newQuantity) => {
    const event = new CustomEvent('PRODUCT_CART_QUANTITY_UPDATED', {
      detail: { productID, newQuantity },
    });
    window.dispatchEvent(event);
  };

  const handleAddProduct = async (productID) => {
    try {
      setCartItems((prevCartItems) => {
        const productIndex = prevCartItems.findIndex((item) => item.productID === productID);
        if (productIndex !== -1) {
          const updatedCartItems = [...prevCartItems];
          const updatedProduct = { ...updatedCartItems[productIndex] };
          updatedProduct.quantity += 1;
          updatedCartItems[productIndex] = updatedProduct;

          setTotal((prevTotal) => prevTotal + parseFloat(updatedProduct.unitPrice * (1 - updatedProduct.discountPercentage/100)));
          dispatchProductQuantityUpdate(productID, updatedProduct.quantity);
          
          return updatedCartItems;
        }
        return prevCartItems;
      });

      await addProductToCart(productID, customerID);

    } catch (err) {
      console.error('Error adding product to cart:', err);
      loadCartProducts();
    }
  };

  const handleRemoveProduct = async (productID) => {
    try {
      setCartItems((prevCartItems) => {
        const productIndex = prevCartItems.findIndex((item) => item.productID === productID);
        if (productIndex !== -1) {
          const updatedCartItems = [...prevCartItems];
          const updatedProduct = { ...updatedCartItems[productIndex] };
          updatedProduct.quantity -= 1;

          if (updatedProduct.quantity > 0) {
            updatedCartItems[productIndex] = updatedProduct;
            setTotal((prevTotal) => prevTotal - parseFloat(updatedProduct.unitPrice * (1 - updatedProduct.discountPercentage/100)));
            dispatchProductQuantityUpdate(productID, updatedProduct.quantity);
          } else {
            updatedCartItems.splice(productIndex, 1);
            setTotal((prevTotal) => prevTotal - parseFloat(updatedProduct.unitPrice * (1 - updatedProduct.discountPercentage/100)));
            dispatchProductQuantityUpdate(productID, 0);
          }

          return updatedCartItems;
        }
        return prevCartItems;
      });

      await removeProductFromCart(productID, customerID);

    } catch (err) {
      console.error('Error removing product from cart:', err);
      loadCartProducts();
    }
  };

  const handleDeleteProduct = async (productID) => {
    try {
      setCartItems((prevItems) => {
        const itemToDelete = prevItems.find((item) => item.productID === productID);
        if (itemToDelete) {
          setTotal((prevTotal) => 
            prevTotal - parseFloat(itemToDelete.unitPrice * (1 - itemToDelete.discountPercentage/100)) * itemToDelete.quantity
          );
          dispatchProductQuantityUpdate(productID, 0);
        }
        return prevItems.filter((item) => item.productID !== productID);
      });

      await deleteProductFromCart(productID, customerID);

    } catch (err) {
      console.error('Error deleting product from cart:', err);
      loadCartProducts();
    }
  };

  const handlePayment = () => {
    if (customerID) {
      handleClose();
      navigate('/payment');
    } else {
      handleClose();
      navigate('/login');
    }
  };

  const handleClose = () => {
    window.dispatchEvent(new Event('CART_UPDATED'));
    onClose();
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={handleClose}>×</button>

      {cartItems.length > 0 && <h2>Your Cart</h2>}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p className="empty-cart-title">Your cart is empty.</p>
          <p className="empty-cart-subtitle">Not sure where to start?</p>
          <div className="category-buttons">
            <Link to="/category/Handbags">
              <button className="start-shopping-button" onClick={handleClose}>Shop Handbags</button>
            </Link>
            <Link to="/category/Backpacks">
              <button className="start-shopping-button" onClick={handleClose}>Shop Backpacks</button>
            </Link>
            <Link to="/category/Luggage">
              <button className="start-shopping-button" onClick={handleClose}>Shop Luggage</button>
            </Link>
            <Link to="/category/Travel%20Bags">
              <button className="start-shopping-button" onClick={handleClose}>Shop Travel Bags</button>
            </Link>
            <Link to="/category/Sports%20Bags">
              <button className="start-shopping-button" onClick={handleClose}>Shop Sports Bags</button>
            </Link>
          </div>
          <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
        </div>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
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
                <div className="cart-price-container">
                  {item.discountPercentage > 0 ? (
                    <>
                      <p className="cart-original-price">${parseFloat(item.unitPrice).toFixed(2)}</p>
                      <p className="cart-discounted-price">
                        ${(parseFloat(item.unitPrice) * (1 - item.discountPercentage / 100)).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p>${parseFloat(item.unitPrice).toFixed(2)}</p>
                  )}
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-button" 
                      onClick={() => handleRemoveProduct(item.productID)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className={`quantity-button ${item.quantity >= item.stock ? 'disabled' : ''}`}
                      onClick={() => handleAddProduct(item.productID)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button className="delete-button" onClick={() => handleDeleteProduct(item.productID)}>
                    {/* Trash Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM4.118 4.5L4 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1l-.118.5H4.118zM3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5V3h-10V2.5z"/>
                    </svg>
                  </button>
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
