// SortingDropdown.js
import React from 'react';
import './SortingDropdown.css';

const SortingDropdown = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    // Seçilen sıralama seçeneğini üst bileşene ilet
    onSortChange(event.target.value);
  };

  return (
    <div className="sorting-dropdown">
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" onChange={handleSortChange}>
        <option value="default">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
