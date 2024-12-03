import React, { useState, useEffect } from 'react';
import './CategorySection.css';
import { getProductImage } from '../../api/storeapi';

const categories = [
  { name: 'Handbags', link: '/category/handbags', productID: 1 },
  { name: 'Backpacks', link: '/category/backpacks', productID: 31 },
  { name: 'Luggage', link: '/category/luggage', productID: 34 },
  { name: 'Travel Bags', link: '/category/Travel%20Bags', productID: 49 },
  { name: 'Sports Bags', link: '/category/Sports%20Bags', productID: 67 },
];

const CategorySection = () => {
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images = {};
      await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await getProductImage(category.productID);
            const imageUrl = URL.createObjectURL(response.data);
            images[category.productID] = imageUrl; 
          } catch (error) {
            console.error(`Error fetching image for product ID ${category.productID}:`, error);
            images[category.productID] = '/images/default-image.jpg';
          }
        })
      );
      setCategoryImages(images); // Resimleri state'e aktar
    };

    fetchCategoryImages();
  }, []);

  return (
    <div className="category-section">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <a key={category.productID} href={category.link} className="category-card">
            <img
              src={categoryImages[category.productID] || '/images/loading-placeholder.jpg'}
              alt={category.name}
            />
            <div className="category-name">{category.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
