import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, sortProductsByName, sortProductsByPrice, sortProductsByPopularity } from '../../api/storeapi';
import ProductCard from '../../components/ProductCard/ProductCard';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';
import './SearchResultPage.css';

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]); // Store initial search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(query);
        const productData = response.data.results || [];
        setProducts(productData);
        setInitialProducts(productData); // Store initial search results
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching search results.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  const handleSortChange = async (sortBy, sortOrder) => {
    try {
      let response;
      if (sortBy === 'default') {
        // Use initial products to reset to default order
        setProducts(initialProducts);
        return;
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

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="no-results-message">"{query}" nothing found.</div>;
  }

  return (
    <div className="search-result-page">
      <div className="search-result-content">
        <div className="sorting-bar">
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <h2>"{query}" Results:</h2>
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.productID}
              id={product.productID}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
