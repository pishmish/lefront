import React from 'react';
import './WishListPage.css';

const WishListPage = () => {
  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      <div className="wishlist-items">
        {/* Add your wishlist items here */}
        <p>No items in your wishlist yet.</p>
      </div>
    </div>
  );
};

export default WishListPage;