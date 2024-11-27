import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import { fetchProductById } from '../../api/storeapi'; // Import the API function

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProductById(productId);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    getProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-images">
        {product.images?.map((image, index) => (
          <img key={index} src={image} alt={`${product.name} ${index + 1}`} className="product-image" />
        ))}
      </div>
      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">${product.price?.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <ul className="product-features">
          {product.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
