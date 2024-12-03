import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Address API calls
export const fetchAddressById = (addressId) => API.get(`/address/id/${addressId}`); // Fetch specific address by ID
export const fetchUserAddresses = (username) => API.get(`/address/${username}`); // Fetch all addresses for a user
export const createAddress = (addressData) => API.post('/address/newaddress', addressData); // Create a new address
export const updateAddress = (addressId, addressData) => API.put(`/address/${addressId}`, addressData); // Update an address
export const deleteAddress = (addressId) => API.delete(`/address/${addressId}`); // Delete an address

// Export default API instance
export default API;
