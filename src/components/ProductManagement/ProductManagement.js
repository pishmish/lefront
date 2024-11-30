// components/ProductManagement/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { fetchProductsForManager, updateProduct, deleteProduct } from '../../api/storeapi';
import './ProductManagement.css';

const ProductManagement = ({ username }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        console.log('Fetching products for manager:', username);
        const response = await fetchProductsForManager(username);
        console.log('Products response:', response);
        
        if (response && response.data) {
          console.log('Products data:', response.data);
          setProducts(response.data);
        } else {
          console.error('No data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      getProducts();
    }
  }, [username]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { 
      id: Date.now(), 
      name: 'New Product', 
      price: 0, 
      description: 'New product description.', 
      discount: 0 
    };
    setProducts([...products, newProduct]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDiscountChange = (id, discount) => {
    setProducts(products.map((product) =>
      product.id === id ? { ...product, discount } : product
    ));
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      stock: product.stock || 0
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.productID !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveEdit = async (productId, updatedData) => {
    try {
      await updateProduct(productId, updatedData);
      setProducts(products.map(p => 
        p.productID === productId ? { ...p, ...updatedData } : p
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-container">
      <h3>Manage Products</h3>
      <div className="product-controls">
        <button className="add-product-button" onClick={handleAddProduct}>
          Add New Product
        </button>
        <input
          type="text"
          className="product-search-bar"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.productID} className="product-card">
            {editingProduct?.productID === product.productID ? (
              <div className="product-edit-form">
                <label>
                  Name:
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                  />
                </label>
                <label>
                  Price:
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct.unitPrice}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      unitPrice: parseFloat(e.target.value)
                    })}
                  />
                </label>
                <label>
                  Stock:
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value)
                    })}
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      description: e.target.value
                    })}
                  />
                </label>
                <div className="edit-buttons">
                  <button 
                    className="save-button"
                    onClick={() => handleSaveEdit(product.productID, editingProduct)}
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
                <p className="description">{product.description}</p>
                <div className="product-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(product.productID)}
                  >
                    Delete
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

export default ProductManagement;
