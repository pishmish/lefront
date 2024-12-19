import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

const API_URL = '/api/wishlist';

export const getOrCreateWishlist = async (customerID) => {
  return await API.post(`/wishlist/customer/${customerID}`);
};

export const addProductToWishlist = async (customerID, productID) => {
  return await API.post(`/wishlist/customer/${customerID}/product/${productID}`);
};

export const removeProductFromWishlist = async (customerID, productID) => {
  return await API.delete(`/wishlist/customer/${customerID}/product/${productID}`);
};

export const deleteWishlist = async (customerID) => {
  return await API.delete(`/wishlist/customer/${customerID}`);
};

export const getWishlistsContainingProduct = async (productID) => {
  return await API.get(`/wishlist/product/${productID}`);
};

export const getWishlistByID = async (id) => {
  return await API.get(`/wishlist/${id}`);
};

export const sendSaleEmail = async () => {
  return await API.post(`/wishlist/sendMail`);
};

export const isProductInWishlist = async (customerID, productID) => {
  return await API.get(`/wishlist/check/${customerID}/${productID}`);
};