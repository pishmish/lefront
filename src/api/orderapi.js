import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Order API calls
export const fetchOrder = (id) => API.get(`/order/getorder/${id}`); // Fetch a specific order by ID
export const fetchUserOrders = () => API.get('/order/user'); // Fetch all orders for a customer
export const fetchSupplierOrders = () => API.get('/order/supplier'); // Fetch all orders for a supplier (product manager)
export const fetchPurchasePrice = (orderId, productId) => API.get(`/order/purchaseprice/${orderId}/${productId}`); // Fetch purchase price for a specific order and product
export const createOrder = (data) => API.post('/order/neworder', data); // Create a new order
export const updateOrder = (id, data) => API.put(`/order/updateorder/${id}`, data); // Update an existing order
export const cancelOrder = (id) => API.put(`/order/cancelorder/${id}`); // Cancel an order
export const updateOrderItems = (id, data) => API.put(`/order/orderitems/${id}`, data); // Update items in an order
export const deleteOrderItems = (id) => API.delete(`/order/orderitems/${id}`); // Delete items from an order

export default API;
