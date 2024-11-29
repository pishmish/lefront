import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Cart API calls
export const fetchCart = () => API.get('/cart'); // Fetch or create a cart
export const addProductToCart = (productID, data) => API.post(`/cart/product/${productID}`, data); // Add product to cart
export const updateProductInCart = (productID, data) => API.put(`/cart/product/${productID}`, data); // Update product quantity
export const deleteProductFromCart = (productID) => API.delete(`/cart/product/${productID}`); // Delete product from cart

// Fetch products in the cart
export const fetchCartProducts = () => API.get('/cart/products'); // Get all products in the cart

// Export default API instance
export default API;
