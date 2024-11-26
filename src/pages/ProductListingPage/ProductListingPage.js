// ProductListingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductListingPage.css';

import ProductCard from '../../components/ProductCard/ProductCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';
import { fetchProducts } from '../../api/storeapi'; // Import the API function

const ProductListingPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        console.log('Products response:', response); // Add this line
        const filteredProducts = response.data.filter(
          (product) => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
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
              id={product.id}
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
