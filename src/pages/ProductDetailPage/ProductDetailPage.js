import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import { fetchProductById, getProductImage, fetchSupplierByProductId, incrementProductPopularity } from '../../api/storeapi';
import { fetchCart, addProductToCart } from '../../api/cartapi'; // Add product to cart API
import ReviewComponent from '../../components/ReviewComponent/ReviewComponent';
import { jwtDecode } from 'jwt-decode';
import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';
import { addProductToWishlist, removeProductFromWishlist, isProductInWishlist } from '../../api/wishlistapi';

const ProductDetailPage = () => {
  const navigate = useNavigate(); // Add this line after useParams
  const { productId } = useParams(); // Retrieve product ID from URL params
  const [product, setProduct] = useState(null); // State for product details
  const [supplier, setSupplier] = useState(null); // State for supplier details
  const [image, setImage] = useState(null); // State for product image
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cartMessage, setCartMessage] = useState(''); // Feedback message for cart actions
  const [customerID, setCustomerID] = useState(null);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0); // Add state for cart quantity
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Add this useEffect after states and before other functions
  useEffect(() => {
    if (productId) {
      incrementProductPopularity(productId).catch(console.error);
    }
  }, [productId]);

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
        //console.log('Product Details:', response.data);
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
      if (product) {
        const cartResponse = await fetchCart(customerID);
        console.log('Cart Response:', cartResponse.data);
        if (cartResponse && cartResponse.data && cartResponse.data.products) {
          console.log('Cart Response:', cartResponse.data);
          const quantityInCart = cartResponse.data.products.reduce((total, item) => {
            if (item.productID === product.productID) {
              return total + item.quantity;
            }
            return total;
          }, 0);
          setCurrentCartQuantity(quantityInCart);
        } else {
          setCurrentCartQuantity(0);
        }
      }
    };

    // Initial fetch
    fetchCartQuantity();

    // Listen for 'CART_UPDATED' event
    const handleCartUpdate = () => {
      fetchCartQuantity();
    };
    window.addEventListener('CART_UPDATED', handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('CART_UPDATED', handleCartUpdate);
    };
  }, [customerID, product]);

  useEffect(() => {
    const fetchInitialCartQuantity = async () => {
      if (customerID && product) {
        const cartResponse = await fetchCart(customerID);
        if (cartResponse && cartResponse.data && cartResponse.data.products) {
          const quantityInCart = cartResponse.data.products
            .filter((item) => item.productID === product.productID)
            .reduce((total, item) => total + item.quantity, 0);
          setCurrentCartQuantity(quantityInCart);
        } else {
          setCurrentCartQuantity(0);
        }
      }
    };

    // Fetch initial quantity
    fetchInitialCartQuantity();

    // Event handler for the custom event
    const handleProductQuantityUpdate = (event) => {
      const { productID, newQuantity } = event.detail;
      if (productID === product.productID) {
        setCurrentCartQuantity(newQuantity);
      }
    };

    // Listen for the custom event
    window.addEventListener('PRODUCT_CART_QUANTITY_UPDATED', handleProductQuantityUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('PRODUCT_CART_QUANTITY_UPDATED', handleProductQuantityUpdate);
    };
  }, [customerID, product]);

  useEffect(() => {
    const handleProductQuantityUpdate = (event) => {
      const { productID, newQuantity } = event.detail;
      if (productID === product.productID) {
        setCurrentCartQuantity(newQuantity);
      }
    };

    window.addEventListener('PRODUCT_CART_QUANTITY_UPDATED', handleProductQuantityUpdate);

    return () => {
      window.removeEventListener('PRODUCT_CART_QUANTITY_UPDATED', handleProductQuantityUpdate);
    };
  }, [product]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!customerID || !productId) return;
        const response = await isProductInWishlist(customerID, productId);
        setIsWishlisted(response.data.exists);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [customerID, productId]);

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

  // Handler for the Add to Wishlist button
  const handleWishlistToggle = async () => {
    try {
      if (!customerID) {
        navigate('/login');
        return;
      }

      if (!isWishlisted) {
        await addProductToWishlist(customerID, productId);
        setIsWishlisted(true);
      } else {
        await removeProductFromWishlist(customerID, productId);
        setIsWishlisted(false);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
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
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount ? 
    numericPrice * (1 - product.discountPercentage / 100) : 
    numericPrice;
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';
  const displayDiscountedPrice = !isNaN(discountedPrice) ? discountedPrice.toFixed(2) : 'N/A';

  // Get closest color hex code
  const closestColorHex = getClosestColor(product.color);

  // Determine if the "Add to Cart" button should be disabled
  //console.log('Current Cart Quantity:', currentCartQuantity);
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
          {hasDiscount && (
            <div className="discount-badge-detail">
              -{product.discountPercentage}%
            </div>
          )}
          {image ? (
            <img src={image} alt={product.name} className="product-image" />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
        {/* Product Details */}
        <div className="product-details">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <button
              onClick={handleWishlistToggle}
              className={`action-button ${isWishlisted ? 'wishlisted' : ''}`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <i className={`fa-heart ${isWishlisted ? 'fas' : 'far'}`}></i>
            </button>
          </div>

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
            {hasDiscount ? (
              <div className="price-wrapper">
                <p className="original-price-detail">${displayPrice}</p>
                <p className="discounted-price-detail">${displayDiscountedPrice}</p>
              </div>
            ) : (
              <p className="product-price">${displayPrice}</p>
            )}
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
