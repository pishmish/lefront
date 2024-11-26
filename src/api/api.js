import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Ensure this matches your backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Store API calls
export const fetchProducts = () => API.get('/store/product'); // Fetch all products
export const fetchProductById = (id) => API.get(`/store/product/${id}`); // Fetch single product
export const fetchCategories = () => API.get('/store/category'); // Fetch categories
export const searchProducts = (query) => API.get(`/store/search?q=${query}`); // Search products

// User Cart API calls
export const fetchCart = () => API.get('/cart'); // Fetch user cart
export const addToCart = (productId, quantity) => API.post('/cart', { productId, quantity }); // Add to cart
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`); // Remove from cart

export default API;