import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../../api/storeapi';
import ProductCard from '../../components/ProductCard/ProductCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortingDropdown from '../../components/SortingDropdown/SortingDropdown';
import './SearchResultPage.css';

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(query);
        const productData = response.data.results || []; // API'den gelen 'results' dizisini al
        setProducts(productData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Arama sonuçları alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

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
      <aside className="filter-sidebar">
        <FilterSidebar onFilterChange={() => {}} /> {/* FilterSidebar bileşeni */}
      </aside>
      <div className="search-result-content">
        <div className="sorting-bar">
          <SortingDropdown onSortChange={() => {}} /> {/* SortingDropdown bileşeni */}
        </div>
        <h2>"{query}" Results:</h2>
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.productID}
              id={product.productID}
              name={product.name}
              price={product.unitPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
