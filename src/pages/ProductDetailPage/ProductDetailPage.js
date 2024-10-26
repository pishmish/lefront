import React from 'react';
import './ProductDetailPage.css';

// Mock Data for a single product (replace with real data later)
const mockProduct = {
  id: 1,
  name: 'Premium Leather Tote',
  price: 120,
  description: 'This premium leather tote is designed for style and durability. Perfect for any occasion, it offers ample space while maintaining a sleek and modern look.',
  images: [
    '/assets/images/leather-tote-1.jpg',
    '/assets/images/leather-tote-2.jpg',
    '/assets/images/leather-tote-3.jpg',
  ],
  category: 'Tote Bags',
  features: [
    '100% genuine leather',
    'Multiple inner compartments',
    'Durable handles',
    'Available in multiple colors',
  ],
};

const ProductDetailPage = () => {
  return (
    <div className="product-detail-page">
      {/* Product Image Gallery */}
      <div className="product-gallery">
        {mockProduct.images.map((image, index) => (
          <img key={index} src={image} alt={`${mockProduct.name} ${index + 1}`} className="product-image" />
        ))}
      </div>

      {/* Product Details Section */}
      <div className="product-details">
        <h1 className="product-name">{mockProduct.name}</h1>
        <p className="product-price">${mockProduct.price.toFixed(2)}</p>
        <p className="product-description">{mockProduct.description}</p>
        <ul className="product-features">
          {mockProduct.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        
        {/* Add to Cart Button */}
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
