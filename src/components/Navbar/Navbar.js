// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
import CartSidebar from '../CartSidebar/CartSidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleUserIconClick = () => {
    navigate('/login');
  };

  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Navigate to category with filter
  const navigateWithFilter = (category, filter) => {
    navigate(`/category/${category}`, { state: { filter } });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Zad à Dos</Link>
        </div>

        <ul className="navbar-links">
          <li>
            <Link to="/category/handbags">Handbags</Link>
            <ul className="dropdown">
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'tote-bags')}>Tote Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'crossbody-bags')}>Crossbody Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'clutch-bags')}>Clutch Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'satchels')}>Satchels</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'shoulder-bags')}>Shoulder Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('handbags', 'hobo-bags')}>Hobo Bags</li>
            </ul>
          </li>
          <li>
            <Link to="/category/backpacks">Backpacks</Link>
            <ul className="dropdown">
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('backpacks', 'casual-backpacks')}>Casual Backpacks</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('backpacks', 'laptop-backpacks')}>Laptop Backpacks</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('backpacks', 'hiking-backpacks')}>Hiking Backpacks</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('backpacks', 'travel-backpacks')}>Travel Backpacks</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('backpacks', 'mini-backpacks')}>Mini Backpacks</li>
            </ul>
          </li>
          <li>
            <Link to="/category/luggage">Luggage</Link>
            <ul className="dropdown">
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('luggage', 'carry-on-bags')}>Carry-On Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('luggage', 'checked-luggage')}>Checked Luggage</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('luggage', 'duffel-bags')}>Duffel Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('luggage', 'garment-bags')}>Garment Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('luggage', 'luggage-sets')}>Luggage Sets</li>
            </ul>
          </li>
          <li>
            <Link to="/category/travel-bags">Travel Bags</Link>
            <ul className="dropdown">
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('travel-bags', 'weekender-bags')}>Weekender Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('travel-bags', 'rolling-bags')}>Rolling Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('travel-bags', 'messenger-bags')}>Messenger Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('travel-bags', 'toiletry-bags')}>Toiletry Bags</li>
            </ul>
          </li>
          <li>
            <Link to="/category/sports-bags">Sports Bags</Link>
            <ul className="dropdown">
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('sports-bags', 'gym-bags')}>Gym Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('sports-bags', 'yoga-bags')}>Yoga Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('sports-bags', 'sports-duffle-bags')}>Sports Duffle Bags</li>
              <li role="button" tabIndex="0" onClick={() => navigateWithFilter('sports-bags', 'cooler-bags')}>Cooler Bags</li>
            </ul>
          </li>
        </ul>

        <div className="navbar-icons">
          <div className="navbar-search">
            <input type="text" placeholder="Search bags..." />
            <button><FiSearch /></button>
          </div>

          {/* User Icon Button */}
          <div className="navbar-user" onClick={handleUserIconClick} role="button" tabIndex={0}>
            <FiUser size={20} />
          </div>

          {/* Cart Icon Button */}
          <div className="navbar-cart" onClick={toggleCartSidebar} role="button" tabIndex={0}>
            <FiShoppingCart size={20} />
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleCartSidebar} />
    </>
  );
};

export default Navbar;
