// ProductListingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductListingPage.css';

import ProductCard from '../../components/ProductCard/ProductCard';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';
import { fetchCategoryProducts, sortProductsByName, sortProductsByPrice, sortProductsByPopularity } from '../../api/storeapi';

const ProductListingPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default'); // Default sort order

  useEffect(() => {
    const getProducts = async () => {
      try {
        // console.log('Fetching products for category:', categoryName); // Log the category name
        const response = await fetchCategoryProducts(categoryName);
        // console.log('Products response:', response); // Log the entire response
        if (response && response.data) {
          // console.log('Products data:', response.data); // Log the products data
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

  const handleSortChange = async (sortBy, sortOrder) => {
    try {
      let response;
      if (sortBy === 'default') {
        // Fetch products again to reset to default order
        response = await fetchCategoryProducts(categoryName);
      } else if (sortBy === 'name') {
        response = await sortProductsByName(sortOrder, products);
      } else if (sortBy === 'price') {
        response = await sortProductsByPrice(sortOrder, products);
      } else if (sortBy === 'popularity') {
        response = await sortProductsByPopularity(sortOrder, products); // Always descending
      }

      if (response && response.data) {
        setProducts(response.data);
      } else {
        console.error('No data in response:', response);
      }
    } catch (error) {
      console.error('Error sorting products:', error);
    }
  };

  return (
    <div className="product-listing-page">
      <div className="product-listing-content">
        <div className="sorting-bar">
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.productID}
                id={product.productID}
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
