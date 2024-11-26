import React, { useState, useEffect } from 'react';
import './FilterSidebar.css';
import { fetchCategories } from '../../api/api'; // Import the API function

const FilterSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="filter-sidebar">
      <h3>Categories</h3>
      <ul className="filter-list">
        {categories.map((category) => (
          <li key={category.id}>
            <label>
              <input
                type="radio"
                name="category"
                value={category.name}
                onChange={() => onFilterChange(category.name)}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterSidebar;
