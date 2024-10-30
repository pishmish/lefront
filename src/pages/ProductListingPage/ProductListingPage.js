// ProductListingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductListingPage.css';

import ProductCard from '../../components/ProductCard/ProductCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';

const mockProducts = [
  {
    id: 1,
    name: 'Elegant Tote Bag',
    price: 75,
    imageUrl: '/assets/images/tote-bag.jpg',
    category: 'tote-bags',
  },
  {
    id: 2,
    name: 'Casual Backpack',
    price: 120,
    imageUrl: '/assets/images/backpack.jpg',
    category: 'backpacks',
  },
  {
    id: 3,
    name: 'Classic Clutch',
    price: 45,
    imageUrl: '/assets/images/clutch.jpg',
    category: 'clutches',
  },
];

const ProductListingPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = mockProducts.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );
    setProducts(filteredProducts);
  }, [categoryName]);

  return (
    <div className="product-listing-page">
      <aside className="filter-sidebar">
        <FilterSidebar onFilterChange={() => {}} />
      </aside>

      <div className="product-listing-content">
        <div className="sorting-bar">
          <SortingDropdown onSortChange={() => {}} />
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id} // Burada id prop'unu ekliyoruz
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
