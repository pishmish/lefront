import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';
import CartSidebar from '../CartSidebar/CartSidebar';
import { AUTH_STATE_CHANGED } from '../../utils/authEvents';

const categories = [
  {
    name: 'Handbags',
    items: [
      { name: 'Tote Bags', link: '/category/Tote Bags', img: '/images/tote-bags.jpg' },
      { name: 'Crossbody Bags', link: '/category/Crossbody Bags', img: '/images/crossbody-bags.jpg' },
      { name: 'Clutch Bags', link: '/category/Clutch Bags', img: '/images/clutch-bags.jpg' },
      { name: 'Satchels', link: '/category/Satchels', img: '/images/satchels.jpg' },
      { name: 'Shoulder Bags', link: '/category/Shoulder Bags', img: '/images/shoulder-bags.jpg' },
      { name: 'Hobo Bags', link: '/category/Hobo Bags', img: '/images/hobo-bags.jpg' },
    ],
  },
  {
    name: 'Backpacks',
    items: [
      { name: 'Casual Backpacks', link: '/category/Casual Backpacks', img: '/images/casual-backpacks.jpg' },
      { name: 'Laptop Backpacks', link: '/category/Laptop Backpacks', img: '/images/laptop-backpacks.jpg' },
      { name: 'Hiking Backpacks', link: '/category/Hiking Backpacks', img: '/images/hiking-backpacks.jpg' },
      { name: 'Travel Backpacks', link: '/category/Travel Backpacks', img: '/images/travel-backpacks.jpg' },
      { name: 'Mini Backpacks', link: '/category/Mini Backpacks', img: '/images/mini-backpacks.jpg' },
    ],
  },
  {
    name: 'Luggage',
    items: [
      { name: 'Carry-On Bags', link: '/category/Carry-On Bags', img: '/images/carry-on-bags.jpg' },
      { name: 'Checked Luggage', link: '/category/Checked Luggage', img: '/images/checked-luggage.jpg' },
      { name: 'Duffel Bags', link: '/category/Duffel Bags', img: '/images/duffel-bags.jpg' },
      { name: 'Garment Bags', link: '/category/Garment Bags', img: '/images/garment-bags.jpg' },
      { name: 'Luggage Sets', link: '/category/Luggage Sets', img: '/images/luggage-sets.jpg' },
    ],
  },
  {
    name: 'Travel Bags',
    items: [
      { name: 'Weekender Bags', link: '/category/Weekender Bags', img: '/images/weekender-bags.jpg' },
      { name: 'Rolling Bags', link: '/category/Rolling Bags', img: '/images/rolling-bags.jpg' },
      { name: 'Messenger Bags', link: '/category/Messenger Bags', img: '/images/messenger-bags.jpg' },
      { name: 'Toiletry Bags', link: '/category/Toiletry Bags', img: '/images/toiletry-bags.jpg' },
    ],
  },
  {
    name: 'Sports Bags',
    items: [
      { name: 'Gym Bags', link: '/category/Gym Bags', img: '/images/gym-bags.jpg' },
      { name: 'Sports Duffle Bags', link: '/category/Sports Duffle Bags', img: '/images/sports-duffle-bags.jpg' },
      { name: 'Cooler Bags', link: '/category/Cooler Bags', img: '/images/cooler-bags.jpg' },
    ],
  },
];

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const dropdownTimeout = useRef(null);

  const checkAuth = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    
    if (token) {
      const decodedToken = jwtDecode(token.split('=')[1]);
      setUserRole(decodedToken.role);
      console.log('Auth check - userRole:', decodedToken.role);
    } else {
      setUserRole(null);
      console.log('Auth check - no token found');
    }
  };

  // Check auth on mount and cookie changes
  useEffect(() => {
    checkAuth();

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
  }, []);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for auth state changes
    window.addEventListener(AUTH_STATE_CHANGED, checkAuth);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED, checkAuth);
    };
  }, []);

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


  const handleLogout = () => {
    // Log current cookies
    console.log('Current cookies before logout:', document.cookie);
    
    // Clear the auth token cookie
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Log cookies after clearing
    console.log('Cookies after logout:', document.cookie);
    
    // Reset userRole state
    setUserRole(null);
    console.log('UserRole after reset:', null);
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Zad à Dos</Link>
        </div>

        <ul className="navbar-links">
          {categories.map((category) => (
            <li
              key={category.name}
              onMouseEnter={() => handleCategoryHover(category.name)}
              onMouseLeave={handleCategoryLeave}
            >
              <Link to={`/category/${category.name}`}>{category.name}</Link>
              {hoveredCategory === category.name && (
                <div className="dropdown-menu">
                  <div
                    className="category-grid"
                    onMouseEnter={() => clearTimeout(dropdownTimeout.current)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="category-item"
                        onClick={() => navigate(item.link)}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => (e.target.src = '/images/default-image.jpg')}
                        />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar-icons">
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
          <Link to="/wishlist">
            <FiHeart size={20} style={{ cursor: 'pointer', color: '#555' }} />
          </Link>
          <div
            className="navbar-user"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
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
          <div className="navbar-cart" onClick={toggleCartSidebar}>
            <FiShoppingCart size={20} />
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={toggleCartSidebar} />
    </>
  );
};

export default Navbar;