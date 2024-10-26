import React from 'react';
import './ProductCard.css';

const ProductCard = ({ name, price, imageUrl, category }) => {
  return (
    <div className="product-card">
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
      <button className="view-product-button">View Product</button>
    </div>
  );
};

export default ProductCard;
