// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import ProductListingPage from './pages/ProductListingPage/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import SalesManagerPage from './pages/SalesManagerPage/SalesManagerPage';
import ProductManagerPage from './pages/ProductManagerPage/ProductManagerPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import WishListPage from './pages/WishListPage/WishListPage';
import SearchResultPage from './pages/SearchResultPage/SearchResultPage';
import InvoicePage from './pages/InvoicePage/InvoicePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Helmet>
          <title>Zad à Dos</title>
        </Helmet>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin/sales" element={<SalesManagerPage />} />
          <Route path="/admin/products" element={<ProductManagerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
