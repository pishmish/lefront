import React, { useState, useEffect, useRef } from 'react';
import { fetchCart } from '../../api/cartapi';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import {jwtDecode} from 'jwt-decode';
import './Navbar.css';
import CartSidebar from '../CartSidebar/CartSidebar';
import { AUTH_STATE_CHANGED } from '../../utils/authEvents';
import { deleteCartIfEmpty } from '../../api/cartapi'; // Import the deleteCartIfEmpty function
import { fetchMainCategories, fetchSubCategories, fetchImage } from '../../api/storeapi';

const Navbar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [customerID, setCustomerID] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryImages, setCategoryImages] = useState({});
  const navigate = useNavigate();
  const dropdownTimeout = useRef(null);

  const checkAuth = () => {
    // Extract customer ID from JWT token
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (!token) {
      console.log('No auth token found');
      setCustomerID(null);
      setUserRole(null);
      return;
    }
    const decodedToken = jwtDecode(token.split('=')[1]);
    const customerID = decodedToken.customerID;
    setCustomerID(customerID); // Set the customerID state
    setUserRole(decodedToken.role); // Set the userRole state
  };

  const updateCartItemCount = async () => {
    try {
      const response = await fetchCart(customerID);
      const cartData = response.data;
      if (cartData && cartData.products && cartData.products.length > 0) {
        const totalItems = cartData.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }
    } catch (err) {
      console.error('Error fetching cart item count:', err);
      setCartItemCount(0);
    }
  };

  // Check auth on mount and cookie changes
  useEffect(() => {
    checkAuth();
    updateCartItemCount();
    // Create observer for cookie changes
    const cookieObserver = new MutationObserver(() => {
      checkAuth();
    });

    // Observe document.cookie for changes
    cookieObserver.observe(document, {
      attributes: true,
      attributeFilter: ['cookie']
    });

    return () => cookieObserver.disconnect();
  }, [customerID]);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for auth state changes
    window.addEventListener(AUTH_STATE_CHANGED, checkAuth);

    // Listen for the custom event to open the cart sidebar
    const handleOpenCartSidebar = () => {
      setIsCartOpen(true);
    };

    window.addEventListener('OPEN_CART_SIDEBAR', handleOpenCartSidebar);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED, checkAuth);
      window.removeEventListener('OPEN_CART_SIDEBAR', handleOpenCartSidebar);
    };
  }, []);

  useEffect(() => {
    updateCartItemCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartItemCount();
    };

    window.addEventListener('CART_UPDATED', handleCartUpdate);

    return () => {
      window.removeEventListener('CART_UPDATED', handleCartUpdate);
    };
  }, [customerID]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [mainResponse, subResponse] = await Promise.all([
          fetchMainCategories(),
          fetchSubCategories()
        ]);

        setMainCategories(mainResponse.data);
        setSubCategories(subResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const loadCategoryImages = async () => {
      const imageUrls = {};
      
      for (const category of subCategories) {
        try {
          const response = await fetchImage(category.name);
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          imageUrls[category.categoryID] = imageUrl;
        } catch (error) {
          console.error(`Error loading image for ${category.name}:`, error);
        }
      }
      
      setCategoryImages(imageUrls);
    };

    if (subCategories.length > 0) {
      loadCategoryImages();
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(categoryImages).forEach(url => URL.revokeObjectURL(url));
    };
  }, [subCategories]);

  // Helper function to get subcategories for a main category
  const getSubcategoriesForMain = (mainCategoryId) => {
    return subCategories.filter(sub => sub.parentCategoryID === mainCategoryId);
  };

  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCategoryHover = (category) => {
    clearTimeout(dropdownTimeout.current);
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    // Log current cookies
    //console.log('Current cookies before logout:', document.cookie);
    
    // Clear the auth token cookie
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Clear the fingerprint cookie
    document.cookie = "fingerprint=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Log cookies after clearing
    // console.log('Cookies after logout:', document.cookie);
    
    // Delete cart if empty
    if (customerID) {
      try {
        await deleteCartIfEmpty(customerID);
        console.log('Cart deleted if empty');
      } catch (err) {
        console.error('Error deleting cart:', err);
      }
    }

    // Reset userRole state
    setUserRole(null);
    setCustomerID(null);
    //console.log('UserRole after reset:', null);
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
        {userRole !== 'salesManager' && userRole !== 'productManager' && (
          <>
            <Link to="/">Zad à Dos</Link>
          </>
        )}  
        {(userRole === 'salesManager' || userRole === 'productManager') && (
          <>
            <Link>Zad à Dos</Link>
          </>
        )}
        </div>
        {userRole !== 'salesManager' && userRole !== 'productManager' && (
          <>
            <ul className="navbar-links">
              {!isLoading && mainCategories.map((category) => (
                <li
                  key={category.categoryID}
                  onMouseEnter={() => handleCategoryHover(category.categoryID)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link to={`/category/${category.name.toLowerCase()}`}>
                    {category.name}
                  </Link>
                  {hoveredCategory === category.categoryID && (
                    <div className="dropdown-menu">
                      <div
                        className="category-grid"
                        onMouseEnter={() => clearTimeout(dropdownTimeout.current)}
                        onMouseLeave={handleCategoryLeave}
                      >
                        {getSubcategoriesForMain(category.categoryID).map((subCategory) => (
                          <div
                            key={subCategory.categoryID}
                            className="category-item"
                            onClick={() => navigate(`/category/${subCategory.name.toLowerCase()}`)}
                          >
                            <div className="category-image-container">
                              <img 
                                src={categoryImages[subCategory.categoryID] || '/placeholder.png'}
                                alt={subCategory.name}
                                onError={(e) => {
                                  e.target.src = '/placeholder.png'; // Replace with default image path
                                  e.target.onerror = null;
                                }}
                              />
                            </div>
                            <p>{subCategory.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}    

        <div className="navbar-icons">
        {userRole !== 'salesManager' && userRole !== 'productManager' && (
          <>
            <div className="navbar-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search bags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <FiSearch />
                </button>
              </form>
            </div>
          </>
        )}  
        {userRole !== 'salesManager' && userRole !== 'productManager' && (
          <>
            <Link to="/wishlist" className="navbar-wishlist">
              <FiHeart size={20} style={{ cursor: 'pointer', color: '#555' }} />
            </Link>  
          </>
        )}  
          <div
            className="navbar-user"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
            style={{ 
              marginRight: (userRole === 'salesManager' || userRole === 'productManager') ? '40px' : '0'
            }}
          >
            <FiUser 
              size={20} 
              style={{ 
                cursor: 'pointer',
                color: userRole ? '#007bff' : '#555' // Highlight icon when logged in
              }} 
            />
            {showUserDropdown && (
              <div className="user-dropdown">
                {userRole ? (
                  // Logged in dropdown
                  <>
                    <button onClick={() => {
                      switch(userRole) {
                        case 'customer':
                          navigate('/profile');
                          break;
                        case 'productManager':
                          navigate('/admin/products');
                          break;
                        case 'salesManager':
                          navigate('/admin/sales');
                          break;
                      }
                      setShowUserDropdown(false);
                    }}>
                      Profile
                    </button>
                    <button onClick={handleLogout}>
                      Log Out
                    </button>
                  </>
                ) : (
                  // Not logged in dropdown
                  <>
                    <button onClick={() => {
                      navigate('/login');
                      setShowUserDropdown(false);
                    }}>
                      Login
                    </button>
                    <button onClick={() => {
                      navigate('/signup'); 
                      setShowUserDropdown(false);
                    }}>
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {userRole !== 'salesManager' && userRole !== 'productManager' && (
            <>
              <div className="navbar-cart" onClick={toggleCartSidebar}>
                <FiShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
              </div>
            </>
          )}      
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={toggleCartSidebar} customerID={customerID} onCartUpdate={updateCartItemCount} />
    </>
  );
};

export default Navbar;