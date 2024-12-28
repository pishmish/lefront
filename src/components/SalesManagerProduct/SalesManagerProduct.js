import React, { useState, useEffect } from 'react';
import axios from 'axios'; // API calls using axios
import { fetchProducts, updateProduct } from '../../api/storeapi'; // fetch and update functions imported
import './SalesManagerProduct.css';

const SalesManagerProduct = () => {
  const [products, setProducts] = useState([]); // Product list
  const [editingProduct, setEditingProduct] = useState(null); // Product being edited
  const [searchTerm, setSearchTerm] = useState(''); // Search term

  // Fetch products from the API when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts(); // Fetch product list
        setProducts(response.data); // Update state with products
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

  const handleSavePrice = async (productId) => {
    try {
      const updatedPriceData = {
        unitPrice: parseFloat(editingProduct.unitPrice) || 0,
      };

      // Update price
      console.log('Updating price with data:', updatedPriceData);
      await updateProduct(productId, updatedPriceData);

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productID === productId
            ? { ...product, unitPrice: updatedPriceData.unitPrice }
            : product
        )
      );
      setEditingProduct(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleSaveDiscount = async (productId) => {
    try {
      // Retrieve the token
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const updatedDiscountData = {
        discountPercentage: parseFloat(editingProduct.discountPercentage) || 0,
      };

      console.log('Updating discount with data:', updatedDiscountData);

      // Include token in the Authorization header
      await axios.put(
        `http://localhost:5001/salesManager/discount/${productId}`,
        updatedDiscountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productID === productId
            ? { ...product, discountPercentage: updatedDiscountData.discountPercentage }
            : product
        )
      );
      setEditingProduct(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating discount:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  const handlePriceChange = (newPrice) => {
    setEditingProduct((prev) => ({
      ...prev,
      unitPrice: newPrice ? parseFloat(newPrice) : 0, // Default to 0 if invalid
    }));
  };

  const handleDiscountChange = (newDiscount) => {
    setEditingProduct((prev) => ({
      ...prev,
      discountPercentage: newDiscount ? parseFloat(newDiscount) : 0, // Default to 0 if invalid
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
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
                    value={editingProduct.unitPrice || 0} // Default to 0 if undefined
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
                    value={editingProduct.discountPercentage || 0} // Default to 0 if undefined
                    onChange={(e) => handleDiscountChange(e.target.value)}
                  />
                </label>

                <div className="edit-buttons">
                  <button
                    className="save-button"
                    onClick={() => handleSavePrice(product.productID)}
                  >
                    Save Price
                  </button>
                  <button
                    className="save-button"
                    onClick={() => handleSaveDiscount(product.productID)}
                  >
                    Save Discount
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
