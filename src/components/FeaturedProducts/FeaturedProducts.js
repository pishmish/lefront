import React from 'react';
import './FeaturedProducts.css';

// Components
import ProductCard from '../ProductCard/ProductCard'; // Reusing ProductCard component

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Stylish Leather Tote',
    price: 95,
    imageUrl: '/assets/images/featured-tote.jpg',
    category: 'Tote Bags',
  },
  {
    id: 2,
    name: 'Vintage Backpack',
    price: 150,
    imageUrl: '/assets/images/featured-backpack.jpg',
    category: 'Backpacks',
  },
  {
    id: 3,
    name: 'Elegant Evening Clutch',
    price: 65,
    imageUrl: '/assets/images/featured-clutch.jpg',
    category: 'Clutches',
  },
  {
    id: 4,
    name: 'Trendy Shoulder Bag',
    price: 110,
    imageUrl: '/assets/images/featured-shoulder-bag.jpg',
    category: 'Shoulder Bags',
  },
  // Add more products as needed
];

const FeaturedProducts = () => {
  return (
    <div className="featured-products">
      <div className="product-grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
