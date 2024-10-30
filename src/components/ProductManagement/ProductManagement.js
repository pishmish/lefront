// components/ProductManagement/ProductManagement.js
import React, { useState } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Elegant Tote Bag', price: 75, description: 'Stylish and durable tote bag.', discount: 0 },
    { id: 2, name: 'Casual Backpack', price: 120, description: 'Comfortable and spacious backpack.', discount: 0 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { id: Date.now(), name: 'New Product', price: 0, description: 'New product description.', discount: 0 };
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-management-container">
      <h3>Manage Products</h3>
      {/* Ürün Ekleme Butonu */}
      <button className="add-product-button" onClick={handleAddProduct}>Add New Product</button>
      
      {/* Ürün Arama Barı */}
      <input
        type="text"
        className="product-search-bar"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Ürün Listesi */}
      <ul className="product-management-list">
        {filteredProducts.map((product) => (
          <li key={product.id} className="product-management-item">
            <strong>{product.name}</strong>
            <p className="product-price">${product.price} 
              {product.discount > 0 && (
                <span className="product-discount"> (-{product.discount}%)</span>
              )}
            </p>
            <p>{product.description}</p>

            {/* İndirim Oranı Girişi */}
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Discount %"
              className="discount-input"
              value={product.discount}
              onChange={(e) => handleDiscountChange(product.id, e.target.value)}
            />

            <div className="action-buttons">
              <button className="action-button edit-button">Edit</button>
              <button className="action-button delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
