import React from 'react';
import './HomePage.css';
// test
// Components
import HeroBanner from '../../components/HeroBanner/HeroBanner';  // A HeroBanner component for the main banner
import CategorySection from '../../components/CategorySection/CategorySection';  // Category section with links to different types of bags
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';  // Featured Products grid

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Section */}
      <section className="category-section">
        <CategorySection />
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <h2>Featured Bags</h2>
        <FeaturedProducts />
      </section>

      {/* Call-to-Action Section (e.g., Newsletter Signup) */}
      <section className="cta-section">
        <div className="cta-content">
          <h3>Sign Up for Exclusive Offers</h3>
          <p>Get 10% off your first order and stay updated with the latest trends.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="button">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
