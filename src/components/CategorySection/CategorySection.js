import React, { useState, useEffect } from 'react';
import './CategorySection.css';
import { getProductImage } from '../../api/storeapi'; // API'den resim almak için import

const categories = [
  { name: 'Handbags', link: '/category/handbags', productID: 1 },
  { name: 'Backpacks', link: '/category/backpacks', productID: 31 },
  { name: 'Luggage', link: '/category/luggage', productID: 34 },
  { name: 'Travel Bags', link: '/category/travel-bags', productID: 49 },
  { name: 'Sports Bags', link: '/category/sports-bags', productID: 67 },
];

const CategorySection = () => {
  const [categoryImages, setCategoryImages] = useState({}); // Resimleri saklamak için state

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images = {};
      await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await getProductImage(category.productID); // Belirli productID için API çağrısı
            const imageUrl = URL.createObjectURL(response.data); // Blob'dan URL oluştur
            images[category.productID] = imageUrl; // Resmi productID'ye göre sakla
          } catch (error) {
            console.error(`Error fetching image for product ID ${category.productID}:`, error);
            images[category.productID] = '/images/default-image.jpg'; // Hata durumunda varsayılan resim
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
              src={categoryImages[category.productID] || '/images/loading-placeholder.jpg'} // Resmi yükle
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
