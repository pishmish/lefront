// components/ProductManagement/SalesManagerProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API calls
import { fetchProducts, updateProduct } from '../../api/storeapi'; // Import the API function for fetching and updating price
import './SalesManagerProduct.css';

const SalesManagerProduct = () => {
  const [products, setProducts] = useState([]); // Initially empty
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts(); // Fetch data using the API
        setProducts(response.data); // Assuming `response.data` contains the product list
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleSaveEdit = async (productId) => {
    try {
      // Update the price
      await updateProduct(productId, {
        unitPrice: parseFloat(editingProduct.unitPrice),
      });

      // Update the discount
      await axios.put(
        `http://localhost:5001/store/product/${productId}/discount`,
        { discountPercentage: parseFloat(editingProduct.discountPercentage) }
      );

      // Update the local state with the updated product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productID === productId
            ? { ...editingProduct }
            : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handlePriceChange = (newPrice) => {
    setEditingProduct((prev) => ({
      ...prev,
      unitPrice: parseFloat(newPrice),
    }));
  };

  const handleDiscountChange = (newDiscount) => {
    setEditingProduct((prev) => ({
      ...prev,
      discountPercentage: parseFloat(newDiscount),
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term state
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-management-container">
      <h3>Manage Products</h3>

      {/* Search bar */}
      <input
        type="text"
        className="product-search-bar"
        placeholder="Search products by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.productID} className="product-card">
            {editingProduct?.productID === product.productID ? (
              <div className="product-edit-form">
                <h4>{product.name}</h4>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Description:</strong> {product.description}</p>

                <label>
                  <strong>Price:</strong>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct.unitPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                </label>
                <label>
                  <strong>Discount (%):</strong>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editingProduct.discountPercentage || 0}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                  />
                </label>

                <div className="edit-buttons">
                  <button
                    className="save-button"
                    onClick={() => handleSaveEdit(product.productID)}
                  >
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h4>{product.name}</h4>
                <p><strong>Price:</strong> ${product.unitPrice}</p>
                <p><strong>Discount:</strong> {product.discountPercentage || 0}%</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Description:</strong> {product.description}</p>

                <div className="product-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
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

export default SalesManagerProduct;
