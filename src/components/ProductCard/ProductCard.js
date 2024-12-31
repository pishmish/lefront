// ProductCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { fetchProductById, getProductImage } from '../../api/storeapi';
import { isProductInWishlist, addProductToWishlist, removeProductFromWishlist } from '../../api/wishlistapi';
import './ProductCard.css';

const ProductCard = ({ id, onWishlistRemove }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetchProductById(id);
        console.log('Product details:', response.data[0]);
        if (response.status === 200) {
          setProduct(response.data[0]);
        } else {
          console.error('Error fetching product details:', response.statusText);
        }
        
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

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

  if (loading || !product) {
    return <div className="product-card">Loading...</div>;
  }

  const numericPrice = parseFloat(product.unitPrice);
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount ? 
    numericPrice * (1 - product.discountPercentage / 100) : 
    numericPrice;
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';
  const displayDiscountedPrice = !isNaN(discountedPrice) ? discountedPrice.toFixed(2) : 'N/A';

  return (
    <div className="product-card">
      {hasDiscount && (
        <div className="discount-badge">
          -{product.discountPercentage}%
        </div>
      )}
      
      <div
        className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`}
        onClick={handleWishlist}
      >
        <i className={`fa-heart ${isWishlisted ? 'fas' : 'far'}`}></i>
      </div>

      <div className="product-card-image" onClick={handleViewProduct}>
        {image ? <img src={image} alt={product.name} /> : <p>Loading image...</p>}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="price-container">
          {hasDiscount ? (
            <>
              <p className="original-price">${displayPrice}</p>
              <p className="discounted-price">${displayDiscountedPrice}</p>
            </>
          ) : (
            <p className="product-card-price">${displayPrice}</p>
          )}
        </div>
        <p className="product-card-stock">Stock: {product.stock}</p>
      </div>

      <button className="view-product-button" onClick={handleViewProduct}>
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
