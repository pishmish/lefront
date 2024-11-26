// ProductCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, name, price, imageUrl, category }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Add logic to add/remove product from wishlist
  };

  return (
    <div className="product-card">
      {/* Wishlist Icon */}
      <div className={`wishlist-icon ${isWishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist}>
        {isWishlisted ? '❤️' : '🤍'}
      </div>

      {/* Product Image */}
      <div className="product-card-image" onClick={handleViewProduct}>
        <img src={imageUrl} alt={name} />
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-category">{category}</p>
        <p className="product-card-price">${price.toFixed(2)}</p>
      </div>

      {/* View Product Button */}
      <button className="view-product-button" onClick={handleViewProduct}>
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
