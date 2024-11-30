import React from 'react';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import CategorySection from '../../components/CategorySection/CategorySection';
import './HomePage.css';

const HomePage = () => (
  <div className="home-page">
    <HeroBanner />
    <CategorySection />
  </div>
);

export default HomePage;
