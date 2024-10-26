import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Example category and price options (you can modify these)
  const categories = ['Tote Bags', 'Backpacks', 'Clutches', 'Shoulder Bags', 'Crossbody Bags'];
  const priceRanges = [
    { label: 'Under $50', value: 'under-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Above $200', value: 'above-200' },
  ];

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, priceRange: selectedPriceRange });
  };

  // Handle price range selection
  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    onFilterChange({ category: selectedCategory, priceRange });
  };

  return (
    <div className="filter-sidebar">
      <h2>Filters</h2>

      {/* Category Filter */}
      <div className="filter-section">
        <h3>Category</h3>
        <ul className="filter-list">
          {categories.map((category) => (
            <li key={category}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h3>Price Range</h3>
        <ul className="filter-list">
          {priceRanges.map((range) => (
            <li key={range.value}>
              <label>
                <input
                  type="radio"
                  name="price"
                  value={range.value}
                  checked={selectedPriceRange === range.value}
                  onChange={() => handlePriceRangeChange(range.value)}
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset Filters Button */}
      <button className="reset-filters-button" onClick={() => {
        setSelectedCategory('');
        setSelectedPriceRange('');
        onFilterChange({ category: '', priceRange: '' });
      }}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
