// ProductCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { getProductImage } from '../../api/storeapi'; // Adjust the import path as necessary

const ProductCard = ({ id, name, price }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [image, setImage] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getProductImage(id);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data); // Create a URL for the blob
          console.log('Fetched image URL:', imageUrl); // Log the image URL
          setImage(imageUrl); // Set the image URL
        } else {
          console.error('Error fetching product image:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };

    fetchImage();
  }, [id]);

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Add logic to add/remove product from wishlist
  };

  // Convert price to a number if it's a string
  const numericPrice = parseFloat(price);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';

  return (
    <div className="product-card">
      {/* Wishlist Icon */}
      <div className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist}>
        {isWishlisted ? '❤️' : '🤍'}
      </div>

      {/* Product Image */}
      <div className="product-card-image" onClick={handleViewProduct}>
        {image ? <img src={image} alt={name} /> : <p>Loading image...</p>}
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">${displayPrice}</p>
      </div>

      {/* View Product Button */}
      <button className="view-product-button" onClick={handleViewProduct}>
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
