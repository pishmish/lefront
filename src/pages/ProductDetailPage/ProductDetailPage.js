import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import useCartStore from '../hooks/useCart'; // Import the custom hook
import { fetchProductById, getProductImage } from '../../api/storeapi';
import { addProductToCart } from '../../api/cartapi'; // Add product to cart API
import ReviewComponent from '../../components/ReviewComponent/ReviewComponent';

const ProductDetailPage = () => {
  const { productId } = useParams(); // Retrieve product ID from URL params
  const [product, setProduct] = useState(null); // State for product details
  const [image, setImage] = useState(null); // State for product image
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { updateCartCount } = useCartStore(); // Get cart count update function
  const [cartMessage, setCartMessage] = useState(''); // Feedback message for cart actions

  // Fetch product details and image when component mounts or productId changes
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await fetchProductById(productId);
        if (response?.data?.length > 0) {
          setProduct(response.data[0]); // Set the product details
        } else {
          throw new Error('No product data found');
        }
      } catch (error) {
        setError('Error fetching product details'); // Set error message
        console.error(error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    const getImage = async () => {
      try {
        const response = await getProductImage(productId);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data);
          setImage(imageUrl); // Set the product image
        } else {
          throw new Error('Error fetching product image');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProductDetails();
    getImage();
  }, [productId]);

  // Handle adding product to the cart
  const handleAddToCart = async () => {
    try {
      const response = await addProductToCart(productId); // Add product with quantity
      updateCartCount(response.data.numProducts); // Update cart count
      setCartMessage('Product added to cart successfully!'); // Success message
      console.log('Add to Cart Response:', response.data);
    } catch (error) {
      setCartMessage('Failed to add product to cart.'); // Error message
      console.error('Error adding product to cart:', error);
    } finally {
      // Clear the message after 3 seconds
      setTimeout(() => setCartMessage(''), 3000);
    }
  };

  // Loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error message display
  if (error) {
    return <div>{error}</div>;
  }

  // Format price for display
  const numericPrice = parseFloat(product.unitPrice);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';

  // Component rendering
  return (
    <div className="product-detail-page">
      {/* Product Top Section */}
      <div className="product-top-section">
        {/* Product Images */}
        <div className="product-images">
          {image ? (
            <img src={image} alt={product.name} className="product-image" />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
        {/* Product Details */}
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
      {/* Product Reviews */}
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
