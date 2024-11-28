import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import { fetchProductById, getProductImage } from '../../api/storeapi';
import ReviewComponent from '../../components/ReviewComponent/ReviewComponent'; // Import ReviewComponent

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Product ID:', productId); // Log the product ID
    const getProduct = async () => {
      try {
        console.log('Fetching product details for ID:', productId); // Log the product ID
        const response = await fetchProductById(productId);
        console.log('Product response:', response); // Log the entire response
        if (response && response.data && response.data.length > 0) {
          console.log('Product data:', response.data[0]); // Log the product data
          setProduct(response.data[0]);
        } else {
          console.error('No data in response:', response);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error); // Log the error
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await getProductImage(productId);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data); // Create a URL for the blob
          console.log('Fetched image URL:', imageUrl); // Log the image URL
          setImage(imageUrl); // Set the image URL
        } else {
          console.error('Error fetching product image:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };

    fetchImage();
    getProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Convert price to a number if it's a string
  const numericPrice = parseFloat(product.unitPrice);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';

  return (
    <div className="product-detail-page">
      <div className="product-images">
        {image ? (
          <img src={image} alt={product.name} className="product-image" />
        ) : (
          <p>Loading image...</p>
        )}
      </div>
      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">${displayPrice}</p>
        <p className="product-description">{product.description}</p>
        <ul className="product-features">
          {product.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p className="product-stock">Stock: {product.stock}</p>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
      {/* Review Component Integration */}
      <div className="product-reviews">
        <ReviewComponent />
      </div>
    </div>
  );
};

export default ProductDetailPage;
