import React, { useState, useEffect } from 'react';
import './WishListPage.css';
import { getOrCreateWishlist } from '../../api/wishlistapi';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

const WishListPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const navigate = useNavigate();

  const handleWishlistRemove = (removedProductId) => {
    setWishlistProducts(prevProducts => 
      prevProducts.filter(product => product.productID !== removedProductId)
    );
  };

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const tokenString = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if (!tokenString) {
          console.log('No auth token found');
          navigate('/login'); // Redirect to login page
          return;
        }
        const tokenValue = tokenString.split('=')[1];
        const decodedToken = jwtDecode(tokenValue);
        const customerID = decodedToken.customerID;

        if (!customerID) {
          console.log('Customer ID not found in token');
          navigate('/login'); // Redirect to login page
          return;
        }

        const response = await getOrCreateWishlist(customerID);
        console.log('Wishlist response:', response);
        if (response.status === 200) {
          setWishlistProducts(response.data.items);
        } else {
          console.error('Error fetching wishlist products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      }
    };

    fetchWishlistProducts();
  }, [navigate]);

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      <div className="wishlist-items">
        {wishlistProducts.length > 0 ? (
          wishlistProducts.map((product) => (
            <ProductCard
              key={product.productID}
              id={product.productID}
              name={product.name}
              price={product.unitPrice}
              stock={product.stock}
              onWishlistRemove={handleWishlistRemove}
            />
          ))
        ) : (
          <div className="no-items-container">
            <p>No items in your wishlist yet.</p>
            <button 
              className="start-shopping-button"
              onClick={() => navigate('/')}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListPage;