import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Category structure with main and subcategories
  const categories = {
    Handbags: ['Tote Bags', 'Crossbody Bags', 'Clutch Bags', 'Satchels', 'Shoulder Bags', 'Hobo Bags'],
    Backpacks: ['Casual Backpacks', 'Laptop Backpacks', 'Hiking Backpacks', 'Travel Backpacks', 'Mini Backpacks'],
    Luggage: ['Carry-On Bags', 'Checked Luggage', 'Duffel Bags', 'Garment Bags', 'Luggage Sets'],
    'Travel Bags': ['Weekender Bags', 'Rolling Bags', 'Messenger Bags', 'Toiletry Bags'],
    'Sports Bags': ['Gym Bags', 'Yoga Bags', 'Sports Duffle Bags', 'Cooler Bags'],
  };

  const priceRanges = [
    { label: 'Under $50', value: 'under-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Above $200', value: 'above-200' },
  ];

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    onFilterChange({ category, subcategory: '', priceRange: selectedPriceRange });
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onFilterChange({ category: selectedCategory, subcategory, priceRange: selectedPriceRange });
  };

  // Handle price range selection
  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    onFilterChange({ category: selectedCategory, subcategory: selectedSubcategory, priceRange });
  };

  return (
    <div className="filter-sidebar">
      <h2>Filters</h2>

      {/* Category Filter */}
      <div className="filter-section">
        <h3>Category</h3>
        <ul className="filter-list">
          {Object.keys(categories).map((category) => (
            <li key={category} className="main-category">
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

              {/* Subcategory Filter */}
              {selectedCategory === category && (
                <ul className="subcategory-list">
                  {categories[category].map((subcategory) => (
                    <li key={subcategory}>
                      <label>
                        <input
                          type="radio"
                          name="subcategory"
                          value={subcategory}
                          checked={selectedSubcategory === subcategory}
                          onChange={() => handleSubcategoryChange(subcategory)}
                        />
                        {subcategory}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
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
      <button
        className="reset-filters-button"
        onClick={() => {
          setSelectedCategory('');
          setSelectedSubcategory('');
          setSelectedPriceRange('');
          onFilterChange({ category: '', subcategory: '', priceRange: '' });
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
