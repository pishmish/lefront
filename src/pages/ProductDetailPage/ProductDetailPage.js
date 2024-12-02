import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import { fetchProductById, getProductImage, fetchSupplierByProductId } from '../../api/storeapi';
import { fetchCart, addProductToCart } from '../../api/cartapi'; // Add product to cart API
import ReviewComponent from '../../components/ReviewComponent/ReviewComponent';
import { jwtDecode } from 'jwt-decode';
import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';

const ProductDetailPage = () => {
  const { productId } = useParams(); // Retrieve product ID from URL params
  const [product, setProduct] = useState(null); // State for product details
  const [supplier, setSupplier] = useState(null); // State for supplier details
  const [image, setImage] = useState(null); // State for product image
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cartMessage, setCartMessage] = useState(''); // Feedback message for cart actions
  const [customerID, setCustomerID] = useState(null);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0); // Add state for cart quantity

  // Initialize color matcher
  const colors = colornames.reduce((accumulator, { name, hex }) => {
    accumulator[name.toLowerCase()] = hex;
    return accumulator;
  }, {});

  const colorMatcher = nearestColor.from(colors);

  // Function to convert color name to hex code
  const colorNameToHex = (colorName) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = colorName;
    return ctx.fillStyle;
  };

  // Function to get the closest color
  const getClosestColor = (colorName) => {
    if (!colorName) return '#000000'; // Default to black if no color name provided

    // Check if the exact color exists
    let exactMatchHex = colors[colorName.toLowerCase()];
    if (exactMatchHex) return exactMatchHex;

    // Try to parse the color name to hex code
    let colorHex;
    try {
      colorHex = colorNameToHex(colorName);
    } catch (e) {
      console.error(`Error parsing color name ${colorName}:`, e);
      return '#000000';
    }

    if (!colorHex) {
      return '#000000';
    }

    // Now find the nearest color using the hex code
    const match = colorMatcher(colorHex);
    return match ? match.value : '#000000';
  };

  // Fetch product details and image when component mounts or productId changes
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await fetchProductById(productId);
        console.log('Product Details:', response.data);
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

    const getSupplierInfo = async () => {
      try {
        const response = await fetchSupplierByProductId(productId);
        console.log("response:", response.data);
        if (response?.data?.length > 0) {
          setSupplier(response.data[0]); // Set the supplier info
        } else {
          throw new Error('No supplier info found');
        }
      } catch (error) {
        console.error(error);
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
    getSupplierInfo();
  }, [productId]);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='));
      if (!token) {
        setCustomerID(null);
        return;
      }
      const decodedToken = jwtDecode(token.split('=')[1]);
      const customerID = decodedToken.customerID;
      setCustomerID(customerID);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (customerID && product) {
        try {
          const response = await fetchCart(customerID);
          const cartData = response.data;
          const productInCart = cartData.products.find(
            (item) => item.productID === Number(productId)  // Convert string to number
          );
          console.log('productInCart:', productInCart);
          setCurrentCartQuantity(productInCart ? productInCart.quantity : 0);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCurrentCartQuantity(0);
        }
      }
    };

    // Initial fetch
    fetchCartQuantity();

    // Set up polling interval (every 5 seconds)
    const intervalId = setInterval(fetchCartQuantity, 5000);

    // Set up event listener for cart updates
    const handleCartUpdate = () => {
      fetchCartQuantity();
    };
    window.addEventListener('CART_UPDATED', handleCartUpdate);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('CART_UPDATED', handleCartUpdate);
    };
  }, [customerID, productId, product]);

  // Handle adding product to the cart
  const handleAddToCart = async () => {
    try {
      const response = await addProductToCart(productId, customerID); // Add product with quantity
      setCartMessage('Product added to cart successfully!'); // Success message
      console.log('Add to Cart Response:', response.data);

      // Dispatch a custom event to notify the Navbar to update the cart count and open the cart sidebar
      const event = new Event('CART_UPDATED');
      window.dispatchEvent(event);

      const openCartEvent = new Event('OPEN_CART_SIDEBAR');
      window.dispatchEvent(openCartEvent);
      
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

  // Get closest color hex code
  const closestColorHex = getClosestColor(product.color);

  // Determine if the "Add to Cart" button should be disabled
  console.log('Current Cart Quantity:', currentCartQuantity);
  const isAddToCartDisabled = product.stock === 0 || currentCartQuantity >= product.stock;

  const renderSupplierInfo = () => {
    if (supplier) {
      return <div>{supplier.name}</div>;
    } else {
      return <div>No supplier information available</div>;
    }
  };

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

          <p className="product-description">{product.description}</p>

          {/* Additional Product Details */}
          <div className="additional-product-details">
            <div className="detail-item">
              <span className="detail-title">Brand: </span>
              <span className="detail-value">{product.brand}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Color: </span>
              <span
                className="color-circle"
                style={{ backgroundColor: closestColorHex }}
                aria-label={`Color: ${product.color}`}
                title={`Color: ${product.color}`}
              ></span>
              <span className="detail-value">{product.color}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Material: </span>
              <span className="detail-value">{product.material}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Capacity: </span>
              <span className="detail-value">{product.capacityLitres} Litres </span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Product ID: </span>
              <span className="detail-value">{product.productID}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Serial Number: </span>
              <span className="detail-value">{product.serialNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Warranty Duration: </span>
              <span className="detail-value">{product.warrantyMonths} Month(s)</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Supplier: </span>
              <span className="detail-value">{renderSupplierInfo()}</span>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="price-stock-container">
            <p className="product-price">${displayPrice}</p>
            <p className="product-stock">Stock: {product.stock}</p>
          </div>

          <button
            className={`add-to-cart-button ${isAddToCartDisabled ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
          >
            Add to Cart
          </button>
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>
      {/* Product Reviews */}
      <div className="product-reviews">
        <ReviewComponent
          productID={product.productID}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
