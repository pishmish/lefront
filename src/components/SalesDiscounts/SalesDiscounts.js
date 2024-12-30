import React, { useState, useEffect } from 'react';
import { fetchProducts, updateProductDiscountPercentage } from '../../api/storeapi';
import { sendSaleEmail } from '../../api/wishlistapi';
import './SalesDiscounts.css';

const SalesDiscounts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({}); // {productId: discountPercentage}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      if (newSelected[product.productID]) {
        delete newSelected[product.productID];
      } else {
        newSelected[product.productID] = product.discountPercentage || 0;
      }
      return newSelected;
    });
  };

  const handleDiscountChange = (productId, value) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: Number(value)
    }));
  };

  const handleApplyDiscounts = async () => {
    try {
      console.log('Selected products:', selectedProducts);
      // Update all selected products
      const updatePromises = Object.entries(selectedProducts).map(([productId, discount]) => 
        updateProductDiscountPercentage(productId, { discountPercentage: discount })
      );
      await Promise.all(updatePromises);

      // Send email notification
      await sendSaleEmail({
        productIDs: Object.keys(selectedProducts).map(Number)
      });

      // Update local state
      setProducts(products.map(p => {
        if (selectedProducts[p.productID] !== undefined) {
          return { ...p, discountPercentage: selectedProducts[p.productID] };
        }
        return p;
      }));

      // Clear selections
      setSelectedProducts({});
      alert('Discounts applied and notifications sent successfully!');
    } catch (error) {
      console.error('Error applying discounts:', error);
      alert('Error applying discounts. Please try again.');
    }
  };

  return (
    <div className="discount-manager-container">
      <div className="products-section">
        <h3>Select Products</h3>
        <input
          type="text"
          className="product-search-bar"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div 
              key={product.productID} 
              className={`product-card ${selectedProducts[product.productID] !== undefined ? 'selected' : ''}`}
              onClick={() => toggleProductSelection(product)}
            >
              <h4>{product.name}</h4>
              <p><strong>Price:</strong> ${product.unitPrice}</p>
              <p><strong>Current Discount:</strong> {product.discountPercentage || 0}%</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="selected-products-panel">
        <h3>Selected Products</h3>
        <div className="selected-products-list">
          {Object.entries(selectedProducts).map(([productId, discount]) => {
            const product = products.find(p => p.productID === Number(productId));
            return (
              <div key={productId} className="selected-product-item">
                <h4>{product.name}</h4>
                <div className="discount-input-group">
                  <label>Discount %:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => handleDiscountChange(productId, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(selectedProducts).length > 0 && (
          <button 
            className="apply-discounts-button"
            onClick={handleApplyDiscounts}
          >
            Apply Discounts & Notify Customers
          </button>
        )}
      </div>
    </div>
  );
};

export default SalesDiscounts;
