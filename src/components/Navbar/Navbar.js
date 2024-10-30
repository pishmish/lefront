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

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Zad à Dos</Link>
        </div>

        <ul className="navbar-links">
          <li><Link to="/category/tote-bags">Tote Bags</Link></li>
          <li><Link to="/category/backpacks">Backpacks</Link></li>
          <li><Link to="/category/clutches">Clutches</Link></li>
          <li><Link to="/category/shoulder-bags">Shoulder Bags</Link></li>
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
