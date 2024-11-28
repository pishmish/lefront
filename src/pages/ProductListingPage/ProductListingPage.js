// ProductListingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductListingPage.css';

import ProductCard from '../../components/ProductCard/ProductCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';
import { fetchCategoryProducts } from '../../api/storeapi';

const ProductListingPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        console.log('Fetching products for category:', categoryName); // Log the category name
        const response = await fetchCategoryProducts(categoryName);
        console.log('Products response:', response); // Log the entire response
        if (response && response.data) {
          console.log('Products data:', response.data); // Log the products data
          setProducts(response.data);
        } else {
          console.error('No data in response:', response);
        }
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
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.productID}
                id={product.productID}
                name={product.name}
                price={product.unitPrice}
                stock={product.stock}
              />
            ))
          ) : (
            <p>No products found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
