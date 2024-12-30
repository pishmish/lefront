import React, { useState, useEffect } from 'react';
import { fetchProductsForManager, updateProductPrice } from '../../api/storeapi';
import './SalesPrices.css';

const SalesPrices = ({ username }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const getProducts = async () => {
    try {
      const response = await fetchProductsForManager(username);
      if (response && response.data) {
        setProducts(response.data);
      } else {
        setError('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      getProducts();
    }
  }, [username]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      newPrice: product.unitPrice
    });
  };

  const handleSaveEdit = async (productId) => {
    try {
      const updatedData = {
        unitPrice: editingProduct.newPrice
      };
      console.log('Updating price:', updatedData);
      await updateProductPrice(productId, updatedData);
      setProducts(products.map(p => 
        p.productID === productId ? { ...p, unitPrice: editingProduct.newPrice } : p
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product &&
    product.name &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="prices-management-container">
      
      <input
        type="text"
        className="product-search-bar"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.productID} className="product-card">
            {editingProduct?.productID === product.productID ? (
              <div className="price-edit-form">
                <h4>{product.name}</h4>
                <label>
                  New Price:
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct.newPrice}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      newPrice: parseFloat(e.target.value)
                    })}
                  />
                </label>
                <div className="edit-buttons">
                  <button 
                    className="save-button"
                    onClick={() => handleSaveEdit(product.productID)}
                  >
                    Save
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h4>{product.name}</h4>
                <p className="price">${product.unitPrice}</p>
                <p className="stock">Stock: {product.stock}</p>
                <div className="product-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit Price
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesPrices;