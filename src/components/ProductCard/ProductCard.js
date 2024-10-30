// ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, name, price, imageUrl, category }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={handleViewProduct}>
      {/* Product Image */}
      <div className="product-card-image">
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
