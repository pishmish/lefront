import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './Navbar.css';
import CartSidebar from '../CartSidebar/CartSidebar';

const categories = [
  {
    name: 'Handbags',
    items: [
      { name: 'Tote Bags', link: '/category/ToteBags', img: '/images/tote-bags.jpg' },
      { name: 'Crossbody Bags', link: '/category/CrossbodyBags', img: '/images/crossbody-bags.jpg' },
      { name: 'Clutch Bags', link: '/category/ClutchBags', img: '/images/clutch-bags.jpg' },
      { name: 'Satchels', link: '/category/Satchels', img: '/images/satchels.jpg' },
      { name: 'Shoulder Bags', link: '/category/ShoulderBags', img: '/images/shoulder-bags.jpg' },
      { name: 'Hobo Bags', link: '/category/HoboBags', img: '/images/hobo-bags.jpg' },
    ],
  },
  {
    name: 'Backpacks',
    items: [
      { name: 'Casual Backpacks', link: '/category/CasualBackpacks', img: '/images/casual-backpacks.jpg' },
      { name: 'Laptop Backpacks', link: '/category/LaptopBackpacks', img: '/images/laptop-backpacks.jpg' },
      { name: 'Hiking Backpacks', link: '/category/HikingBackpacks', img: '/images/hiking-backpacks.jpg' },
      { name: 'Travel Backpacks', link: '/category/TravelBackpacks', img: '/images/travel-backpacks.jpg' },
      { name: 'Mini Backpacks', link: '/category/MiniBackpacks', img: '/images/mini-backpacks.jpg' },
    ],
  },
  {
    name: 'Luggage',
    items: [
      { name: 'Carry-On Bags', link: '/category/Carry-OnBags', img: '/images/carry-on-bags.jpg' },
      { name: 'Checked Luggage', link: '/category/CheckedLuggage', img: '/images/checked-luggage.jpg' },
      { name: 'Duffel Bags', link: '/category/DuffelBags', img: '/images/duffel-bags.jpg' },
      { name: 'Garment Bags', link: '/category/GarmentBags', img: '/images/garment-bags.jpg' },
      { name: 'Luggage Sets', link: '/category/LuggageSets', img: '/images/luggage-sets.jpg' },
    ],
  },
  {
    name: 'Travel Bags',
    items: [
      { name: 'Weekender Bags', link: '/category/WeekenderBags', img: '/images/weekender-bags.jpg' },
      { name: 'Rolling Bags', link: '/category/RollingBags', img: '/images/rolling-bags.jpg' },
      { name: 'Messenger Bags', link: '/category/MessengerBags', img: '/images/messenger-bags.jpg' },
      { name: 'Toiletry Bags', link: '/category/ToiletryBags', img: '/images/toiletry-bags.jpg' },
    ],
  },
  {
    name: 'Sports Bags',
    items: [
      { name: 'Gym Bags', link: '/category/GymBags', img: '/images/gym-bags.jpg' },
      { name: 'Sports Duffle Bags', link: '/category/SportsDuffleBags', img: '/images/sports-duffle-bags.jpg' },
      { name: 'Cooler Bags', link: '/category/CoolerBags', img: '/images/cooler-bags.jpg' },
    ],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false); // For Login/Sign-Up hover
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeout = useRef(null); // Ref to handle hover delay

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
            <FiUser size={20} />
            {showUserDropdown && (
              <div className="user-dropdown">
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/signup')}>Sign Up</button>
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
