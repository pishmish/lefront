import React from 'react';
import './HomePage.css';

// Components
import HeroBanner from '../../components/HeroBanner/HeroBanner';  // A HeroBanner component for the main banner
import CategorySection from '../../components/CategorySection/CategorySection';  // Category section with links to different types of bags

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Section */}
      <section className="category-section">
        <CategorySection />
      </section>
    </div>
  );
};

export default HomePage;
