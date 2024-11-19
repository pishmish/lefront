// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './Navbar.css';
import CartSidebar from '../CartSidebar/CartSidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleUserIconClick = () => {
    navigate('/login');
  };

  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const categories = [
    {
      name: 'Handbags',
      items: [
        { name: 'Tote Bags', link: '/category/handbags/tote-bags', img: '/assets/images/tote-bags.jpg' },
        { name: 'Crossbody Bags', link: '/category/handbags/crossbody-bags', img: '/assets/images/crossbody-bags.jpg' },
        { name: 'Clutch Bags', link: '/category/handbags/clutch-bags', img: '/assets/images/clutch-bags.jpg' },
        { name: 'Satchels', link: '/category/handbags/satchels', img: '/assets/images/satchels.jpg' },
        { name: 'Shoulder Bags', link: '/category/handbags/shoulder-bags', img: '/assets/images/shoulder-bags.jpg' },
        { name: 'Hobo Bags', link: '/category/handbags/hobo-bags', img: '/assets/images/hobo-bags.jpg' },
      ],
    },
    {
      name: 'Backpacks',
      items: [
        { name: 'Casual Backpacks', link: '/category/backpacks/casual-backpacks', img: '/assets/images/casual-backpacks.jpg' },
        { name: 'Laptop Backpacks', link: '/category/backpacks/laptop-backpacks', img: '/assets/images/laptop-backpacks.jpg' },
        { name: 'Hiking Backpacks', link: '/category/backpacks/hiking-backpacks', img: '/assets/images/hiking-backpacks.jpg' },
        { name: 'Travel Backpacks', link: '/category/backpacks/travel-backpacks', img: '/assets/images/travel-backpacks.jpg' },
        { name: 'Mini Backpacks', link: '/category/backpacks/mini-backpacks', img: '/assets/images/mini-backpacks.jpg' },
      ],
    },
    {
      name: 'Luggage',
      items: [
        { name: 'Carry-On Bags', link: '/category/luggage/carry-on-bags', img: '/assets/images/carry-on-bags.jpg' },
        { name: 'Checked Luggage', link: '/category/luggage/checked-luggage', img: '/assets/images/checked-luggage.jpg' },
        { name: 'Duffel Bags', link: '/category/luggage/duffel-bags', img: '/assets/images/duffel-bags.jpg' },
        { name: 'Garment Bags', link: '/category/luggage/garment-bags', img: '/assets/images/garment-bags.jpg' },
        { name: 'Luggage Sets', link: '/category/luggage/luggage-sets', img: '/assets/images/luggage-sets.jpg' },
      ],
    },
    {
      name: 'Travel Bags',
      items: [
        { name: 'Weekender Bags', link: '/category/travel-bags/weekender-bags', img: '/assets/images/weekender-bags.jpg' },
        { name: 'Rolling Bags', link: '/category/travel-bags/rolling-bags', img: '/assets/images/rolling-bags.jpg' },
        { name: 'Messenger Bags', link: '/category/travel-bags/messenger-bags', img: '/assets/images/messenger-bags.jpg' },
        { name: 'Toiletry Bags', link: '/category/travel-bags/toiletry-bags', img: '/assets/images/toiletry-bags.jpg' },
      ],
    },
    {
      name: 'Sports Bags',
      items: [
        { name: 'Gym Bags', link: '/category/sports-bags/gym-bags', img: '/assets/images/gym-bags.jpg' },
        { name: 'Yoga Bags', link: '/category/sports-bags/yoga-bags', img: '/assets/images/yoga-bags.jpg' },
        { name: 'Sports Duffle Bags', link: '/category/sports-bags/sports-duffle-bags', img: '/assets/images/sports-duffle-bags.jpg' },
        { name: 'Cooler Bags', link: '/category/sports-bags/cooler-bags', img: '/assets/images/cooler-bags.jpg' },
      ],
    },
  ];

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
              <Link to={`/category/${category.name.toLowerCase()}`}>{category.name}</Link>
              {hoveredCategory === category.name && (
                <div className="dropdown-menu">
                  <div className="category-grid">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="category-item"
                        onClick={() => navigate(item.link)}
                      >
                        <img src={item.img} alt={item.name} />
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
            <input type="text" placeholder="Search bags..." />
            <button>
              <FiSearch />
            </button>
          </div>
          <Link to="/wishlist">
            <FiHeart size={20} style={{ cursor: 'pointer', color: '#555' }} />
          </Link>
          <div className="navbar-user" onClick={handleUserIconClick}>
            <FiUser size={20} />
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
