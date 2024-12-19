// ProductCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getProductImage } from '../../api/storeapi';
import { isProductInWishlist, addProductToWishlist, removeProductFromWishlist } from '../../api/wishlistapi';
import './ProductCard.css'; // Ensure you have appropriate CSS for .wishlisted

const ProductCard = ({ id, name, price, stock, initialWishlisted = false, onWishlistRemove }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getProductImage(id);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data);
          setImage(imageUrl);
        } else {
          console.error('Error fetching product image:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };

    fetchImage();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const tokenString = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if (!tokenString) return;
        
        const tokenValue = tokenString.split('=')[1];
        const decodedToken = jwtDecode(tokenValue);
        const customerID = decodedToken.customerID;
        
        const response = await isProductInWishlist(customerID, id);
        setIsWishlisted(response.data.exists);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [id]);

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const tokenString = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (!tokenString) {
        console.log('No auth token found');
        navigate('/login');
        return;
      }
      const tokenValue = tokenString.split('=')[1];
      const decodedToken = jwtDecode(tokenValue);
      const customerID = decodedToken.customerID;

      if (!customerID) {
        console.log('Customer ID not found in token');
        navigate('/login');
        return;
      }

      if (!isWishlisted) {
        await addProductToWishlist(customerID, id);
        setIsWishlisted(true);
        console.log('Product added to wishlist');
      } else {
        await removeProductFromWishlist(customerID, id);
        setIsWishlisted(false);
        console.log('Product removed from wishlist');
        if (onWishlistRemove) {
          onWishlistRemove(id);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const numericPrice = parseFloat(price);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';

  return (
    <div className="product-card">
      {/* Wishlist Icon */}
      <div
        className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`}
        onClick={handleWishlist}
      >
        <i className={`fa-heart ${isWishlisted ? 'fas' : 'far'}`}></i>
      </div>

      {/* Product Image */}
      <div className="product-card-image" onClick={handleViewProduct}>
        {image ? <img src={image} alt={name} /> : <p>Loading image...</p>}
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">${displayPrice}</p>
        <p className="product-card-stock">Stock: {stock}</p>
      </div>

      {/* View Product Button */}
      <button className="view-product-button" onClick={handleViewProduct}>
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
