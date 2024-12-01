// SortingDropdown.js
import React from 'react';
import './SortingDropdown.css';

const SortingDropdown = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    onSortChange(sortBy, sortOrder);
  };

  return (
    <div className="sorting-dropdown">
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" onChange={handleSortChange} defaultValue="default">
        <option value="default">Default</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="popularity-desc">Popularity</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
