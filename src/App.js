import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import ProductListingPage from './pages/ProductListingPage/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import AdminPage from './pages/AdminPage/AdminPage';
import CustomerLoginPage from './pages/CustomerLoginPage/CustomerLoginPage';
import WishListPage from './pages/WishListPage/WishListPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/customer" element={<CustomerLoginPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
