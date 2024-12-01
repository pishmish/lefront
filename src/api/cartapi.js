import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Cart API calls
export const fetchCart = (customerID) => API.post('/cart/fetch', { customerID }); // Fetch or create a cart
export const addProductToCart = (productID, customerID) => API.post(`/cart/product/${productID}`, { customerID }); // Add product to cart
export const removeProductFromCart = (productID, customerID) => API.put(`/cart/product/${productID}`, { customerID }); // Update product quantity
export const deleteProductFromCart = (productID) => API.delete(`/cart/product/${productID}`); // Delete product from cart
export const mergeCartsOnLogin = (customerID) => API.post(`/cart/merge/${customerID}`); // Merge carts on login
export const deleteCartIfEmpty = (customerID) => API.put(`/cart/permanent/${customerID}`); // Merge carts on login

export const fetchCartProducts = () => API.get('/cart/products'); // Get all products in the cart

// Export default API instance
export default API;

