import React from 'react';
import './CategorySection.css';

const categories = [
  { name: 'Tote Bags', image: '/path-to-your-image/tote.jpg', link: '/category/tote-bags' },
  { name: 'Backpacks', image: '/path-to-your-image/backpack.jpg', link: '/category/backpacks' },
  { name: 'Clutches', image: '/path-to-your-image/clutch.jpg', link: '/category/clutches' },
  { name: 'Shoulder Bags', image: '/path-to-your-image/shoulder.jpg', link: '/category/shoulder-bags' },
];

const CategorySection = () => {
  return (
    <div className="category-section">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category, index) => (
          <a key={index} href={category.link} className="category-card">
            <img src={category.image} alt={category.name} />
            <div className="category-name">{category.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
