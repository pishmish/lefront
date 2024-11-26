import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// User Authentication and Profile Management
export const registerUser = (userData) => API.post('/user/register', userData); // User registration
export const loginUser = (credentials) => API.post('/user/login', credentials); // User login
export const fetchUserProfile = () => API.get('/user/profile'); // Fetch user profile
export const updateUserProfile = (profileData) => API.put('/user/profile', profileData); // Update user profile
export const deleteUser = () => API.delete('/user/removeuser'); // Delete user account

// User Billing Management
export const fetchBillingInfo = () => API.get('/user/billing'); // Fetch all billing information for the user
export const fetchBillingInfoById = (id) => API.get(`/user/billing/${id}`); // Fetch billing information by ID
export const createBillingInfo = (billingData) => API.post('/user/billing', billingData); // Add billing information
export const updateBillingInfo = (id, billingData) =>
    API.put(`/user/billing/${id}`, billingData); // Update billing information by ID
export const deleteBillingInfo = (id) => API.delete(`/user/billing/${id}`); // Delete billing information by ID

// Export default API instance
export default API;
