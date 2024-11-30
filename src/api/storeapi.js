import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Store API calls
export const fetchProducts = () => API.get('/store/product'); // Fetch all products
export const fetchProductById = (id) => API.get(`/store/product/${id}`); // Fetch single product
export const createProduct = (data) => API.post('/store/product', data); // Create new product
export const updateProduct = (id, data) => API.put(`/store/product/${id}`, data); // Update product
export const deleteProduct = (id) => API.delete(`/store/product/${id}`); // Delete product

export const fetchCategories = () => API.get('/store/category'); // Fetch categories
export const fetchCategoryByName = (name) => API.get(`/store/category/${name}`); // Fetch category by name
export const createCategory = (data) => API.post('/store/category', data); // Create new category
export const updateCategory = (id, data) => API.put(`/store/category/${id}`, data); // Update category
export const deleteCategory = (id) => API.delete(`/store/category/${id}`); // Delete category
export const fetchCategoryProducts = (name) => API.get(`/store/category/${name}/products`); // Fetch products in category

export const searchProducts = (query) => API.get(`/store/search?q=${query}`); // Search products

// Reviews API calls
export const fetchReviews = (productId) => API.get(`/store/product/${productId}/reviews`); // Fetch all reviews for a product
export const fetchApprovedReviews = (productId) => API.get(`/store/product/${productId}/reviews/approved`); // Fetch all reviews for a product
export const fetchReviewById = (productId, reviewId) =>
    API.get(`/store/product/${productId}/reviews/${reviewId}`); // Fetch single review
export const fetchPendingReviews = (username) => 
  API.get(`/store/reviews/pending/${username}`); // Fetch all reviews for a product
export const createReview = (productId, reviewContent, reviewStars, customerID) => API.post(`/store/product/${productId}/reviews`, productId, reviewContent, reviewStars, customerID); // Add review
export const updateReview = (productId, reviewId, data) =>
    API.put(`/store/product/${productId}/reviews/${reviewId}`, data); // Update review
export const updateReviewApprovalStatus = (reviewId, approvalStatus) =>
    API.put(`/store/reviews/${reviewId}`, approvalStatus); // Update review approval status
export const deleteReview = (reviewId) => API.delete(`/store/reviews/${reviewId}`); // Delete review

// Sorting API calls
export const sortProductsBy = (field, order) => API.get(`/store/product/sort/${field}/${order}`);

// Predefined sorting functions
export const sortProductsByStock = (order) => sortProductsBy('stock', order);
export const sortProductsByName = (order) => sortProductsBy('name', order);
export const sortProductsByPrice = (order) => sortProductsBy('price', order);
export const sortProductsByRating = (order) => sortProductsBy('rating', order);
export const sortProductsByDiscount = (order) => sortProductsBy('discount', order);
export const sortProductsByTimeListed = (order) => sortProductsBy('newProducts', order);
export const sortProductsByBrand = (order) => sortProductsBy('brand', order);
export const sortProductsByColor = (order) => sortProductsBy('color', order);
export const sortProductsBySupplier = (order) => sortProductsBy('supplier', order);
export const sortProductsByMaterial = (order) => sortProductsBy('material', order);
export const sortProductsByCapacity = (order) => sortProductsBy('capacity', order);
export const sortProductsByWarranty = (order) => sortProductsBy('warranty', order);
export const sortProductsByPopularity = (order) => sortProductsBy('popularity', order);

// API call to get product image
export const getProductImage = (id) => API.get(`/store/product/${id}/image`, { responseType: 'blob' });

// Export default API instance
export default API;
