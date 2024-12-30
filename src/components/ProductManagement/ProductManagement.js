// components/ProductManagement/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { fetchProductsForManager, updateProduct, deleteProduct, createProduct, fetchSubCategories } from '../../api/storeapi';
import './ProductManagement.css';

const ProductManagement = ({ username }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newProductData, setNewProductData] = useState({
    name: '',
    unitPrice: 0,
    stock: 0,
    description: '',
    brand: '',
    color: '',
    material: '',
    warrantyMonths: 0,
    serialNumber: '',
    capacityLitres: 0,
    supplierID: '',
    categoryName: '',
    // Include other necessary fields
  });

  const getProducts = async () => {
    try {
      console.log('Fetching products for manager:', username);
      const response = await fetchProductsForManager(username);
      console.log('Products response:', response);
      
      if (response && response.data) {
        console.log('Products data:', response.data);
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
    const getCategories = async () => {
      try {
        const response = await fetchSubCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (username) {
      getProducts();
      getCategories();
    }
  }, [username]);

  const handleAddProduct = () => {
    setIsAddingProduct(true);
  };

  const handleSaveNewProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProductData.name);
      formData.append('unitPrice', newProductData.unitPrice);
      formData.append('stock', newProductData.stock);
      formData.append('description', newProductData.description);
      formData.append('brand', newProductData.brand);
      formData.append('color', newProductData.color);
      formData.append('material', newProductData.material);
      formData.append('warrantyMonths', newProductData.warrantyMonths);
      formData.append('serialNumber', newProductData.serialNumber);
      formData.append('capacityLitres', newProductData.capacityLitres);
      formData.append('supplierID', newProductData.supplierID);
      formData.append('categoryName', newProductData.categoryName);
      // Append other fields as required
      if (newProductData.image) {
        formData.append('image', newProductData.image);
      }
      const response = await createProduct(formData);
      setProducts([...products, response.data]);
      setIsAddingProduct(false);
      setNewProductData({
        name: '',
        unitPrice: 0,
        stock: 0,
        description: '',
        brand: '',
        color: '',
        material: '',
        warrantyMonths: 0,
        serialNumber: '',
        capacityLitres: 0,
        supplierID: '',
        categoryName: '',
        // Reset other fields
      });
      await getProducts(); // Fetch updated products list
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
    product &&
    product.name &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-container">
      <div className="product-controls">
        <button className="add-product-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      </div>

      {isAddingProduct && (
        <div className="product-edit-form">
          <label>
            Name:
            <input
              type="text"
              value={newProductData.name}
              onChange={(e) => setNewProductData({
                ...newProductData,
                name: e.target.value
              })}
            />
          </label>
          {isAddingProduct ? (
            // Price field for new product - editable
            <label>
              Price:
              <input
                type="number"
                min="0"
                step="0.01"
                value={newProductData.unitPrice}
                onChange={(e) => setNewProductData({
                  ...newProductData,
                  unitPrice: parseFloat(e.target.value)
                })}
              />
            </label>
          ) : (
            // Price field for editing - read only
            <label>
              Price:
              <input
                type="number"
                value={editingProduct?.unitPrice || 0}
                readOnly
                disabled
              />
            </label>
          )}
          <label>
            Stock:
            <input
              type="number"
              min="0"
              value={newProductData.stock}
              onChange={(e) => setNewProductData({
                ...newProductData,
                stock: parseInt(e.target.value)
              })}
            />
          </label>
          <label>
            Description:
            <textarea
              value={newProductData.description}
              onChange={(e) => setNewProductData({
                ...newProductData,
                description: e.target.value
              })}
            />
          </label>
          <label>
            Brand:
            <input
              type="text"
              value={newProductData.brand}
              onChange={(e) => setNewProductData({
                ...newProductData,
                brand: e.target.value
              })}
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              value={newProductData.color}
              onChange={(e) => setNewProductData({
                ...newProductData,
                color: e.target.value
              })}
            />
          </label>
          <label>
            Material:
            <input
              type="text"
              value={newProductData.material}
              onChange={(e) => setNewProductData({
                ...newProductData,
                material: e.target.value
              })}
            />
          </label>
          <label>
            Warranty Months:
            <input
              type="number"
              min="0"
              value={newProductData.warrantyMonths}
              onChange={(e) => setNewProductData({
                ...newProductData,
                warrantyMonths: parseInt(e.target.value)
              })}
            />
          </label>
          <label>
            Serial Number:
            <input
              type="text"
              value={newProductData.serialNumber}
              onChange={(e) => setNewProductData({
                ...newProductData,
                serialNumber: e.target.value
              })}
            />
          </label>
          <label>
            Capacity Litres:
            <input
              type="number"
              min="0"
              step="0.1"
              value={newProductData.capacityLitres}
              onChange={(e) => setNewProductData({
                ...newProductData,
                capacityLitres: parseFloat(e.target.value)
              })}
            />
          </label>
          <label>
            Category:
            <select
              value={newProductData.categoryName}
              onChange={(e) => setNewProductData({
                ...newProductData,
                categoryName: e.target.value
              })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryID} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProductData({
                ...newProductData,
                image: e.target.files[0]
              })}
            />
          </label>
          <div className="edit-buttons">
            <button 
              className="save-button"
              onClick={handleSaveNewProduct}
            >
              Save
            </button>
            <button 
              className="cancel-button"
              onClick={() => setIsAddingProduct(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!isAddingProduct && (
        <input
          type="text"
          className="product-search-bar"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      )}

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
                {isAddingProduct ? (
                  // Price field for new product - editable
                  <label>
                    Price:
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProductData.unitPrice}
                      onChange={(e) => setNewProductData({
                        ...newProductData,
                        unitPrice: parseFloat(e.target.value)
                      })}
                    />
                  </label>
                ) : (
                  // Price field for editing - read only
                  <label>
                    Price:
                    <input
                      type="number"
                      value={editingProduct?.unitPrice || 0}
                      readOnly
                      disabled
                    />
                  </label>
                )}
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
