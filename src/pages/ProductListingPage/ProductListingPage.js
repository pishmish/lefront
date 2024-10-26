import React, { useState } from 'react';
import './ProductListingPage.css';

// Components
import ProductCard from '../../components/ProductCard/ProductCard'; // Component to display individual product cards
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'; // Sidebar for filters
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown'; // Dropdown for sorting options

// Mock data for now
const mockProducts = [
  {
    id: 1,
    name: 'Elegant Tote Bag',
    price: 75,
    imageUrl: '/assets/images/tote-bag.jpg',
    category: 'Tote Bags',
  },
  {
    id: 2,
    name: 'Casual Backpack',
    price: 120,
    imageUrl: '/assets/images/backpack.jpg',
    category: 'Backpacks',
  },
  {
    id: 3,
    name: 'Classic Clutch',
    price: 45,
    imageUrl: '/assets/images/clutch.jpg',
    category: 'Clutches',
  },
  // Add more mock products as needed
];

const ProductListingPage = () => {
  const [products, setProducts] = useState(mockProducts);

  // Placeholder for filter and sorting logic
  const handleFilterChange = (filters) => {
    // Logic to filter products based on filters
  };

  const handleSortChange = (sortOption) => {
    // Logic to sort products based on sort option
  };

  return (
    <div className="product-listing-page">
      {/* Sidebar for Filters */}
      <aside className="filter-sidebar">
        <FilterSidebar onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content - Product Grid */}
      <div className="product-listing-content">
        <div className="sorting-bar">
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <div className="product-grid">
          {products.map((product) => (
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
    </div>
  );
};

export default ProductListingPage;
