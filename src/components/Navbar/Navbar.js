import React from 'react';
import './Navbar.css'; // Custom CSS file for styles
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi'; // React Icons for User and Cart

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <a href="/">Zad à Dos</a>
      </div>

      {/* Center Navigation Links */}
      <ul className="navbar-links">
        <li><a href="/category/tote-bags">Tote Bags</a></li>
        <li><a href="/category/backpacks">Backpacks</a></li>
        <li><a href="/category/clutches">Clutches</a></li>
        <li><a href="/category/shoulder-bags">Shoulder Bags</a></li>
      </ul>

      {/* Right Side Icons and Search */}
      <div className="navbar-icons">
        {/* Search Bar */}
        <div className="navbar-search">
          <input type="text" placeholder="Search bags..." />
          <button><FiSearch /></button>
        </div>
        
        {/* User and Cart Icons */}
        <div className="navbar-user">
          <FiUser size={20} />
        </div>
        <div className="navbar-cart">
          <FiShoppingCart size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
