import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import { fetchProductById, getProductImage } from '../../api/storeapi';
import { addProductToCart } from '../../api/cartapi'; // Import addProductToCart API
import ReviewComponent from '../../components/ReviewComponent/ReviewComponent';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(''); // State for showing feedback messages

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProductById(productId);
        if (response && response.data && response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          console.error('No data in response:', response);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await getProductImage(productId);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data);
          setImage(imageUrl);
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

 const handleAddToCart = async () => {
    try {
      // Call the API to add the product to the cart
      const response = await addProductToCart(productId, { quantity: 1 }); // Adjust quantity as needed
      setCartMessage('Product added to cart successfully!');
      console.log('Add to Cart Response:', response.data);
    } catch (error) {
      setCartMessage('Failed to add product to cart.');
      console.error('Error adding product to cart:', error);
    }

    // Clear the message after a delay
    setTimeout(() => setCartMessage(''), 3000);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const numericPrice = parseFloat(product.unitPrice);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';

  return (
    <div className="product-detail-page">
      <div className="product-top-section">
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
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>
      <div className="product-reviews">
        <ReviewComponent
          id={product.productID}
          overallRating={product.overallRating}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
