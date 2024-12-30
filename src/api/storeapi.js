import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Store API calls
export const fetchProducts = () => API.get('/store/product'); // Fetch all products
export const fetchProductById = (id) => API.get(`/store/product/${id}`); // Fetch single product
export const fetchSupplierByProductId = (id) => API.get(`/store/supplier/${id}`); // Fetch supplier by product ID
export const createProduct = (data) => API.post('/store/product', data); // Create new product
export const updateProduct = (id, data) => API.put(`/store/product/${id}`, data); // Update product
export const updateProductPrice = (id, data) => API.put(`/store/product/price/${id}`, data); // Update product price
export const updateProductDiscountPercentage = (id, data) => API.put(`/store/product/discount/${id}`, data); // Update product discount percentage
export const deleteProduct = (id) => API.delete(`/store/product/${id}`); // Delete product
export const incrementProductPopularity = (id) => API.put(`/store/product/popularity/${id}`); // Increment product popularity
//export const fetchProductsBySupplier = (supplierId) => API.get(`/store/product/supplier/${supplierId}`);
export const fetchProductsForManager= (username) => API.get(`/store/product/admin/${username}`);


export const fetchMainCategories = () => API.get('/store/category/main'); // Fetch categories
export const fetchSubCategories = () => API.get('/store/category/sub'); // Fetch categories
export const fetchCategoryByName = (name) => API.get(`/store/category/${name}`); // Fetch category by name
export const createCategory = (formData) => 
  API.post('/store/category', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }); // Create new category
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
export const fetchOverAllRating = (productID) => API.get(`/store/reviews/overallRating/${productID}`); // Fetch overall rating for a product

// Sorting API calls
export const sortProductsBy = (sortBy, sortOrder, data) => API.post(`/store/sort?sortBy=${sortBy}&sortOrder=${sortOrder}`, data);

// Predefined sorting functions
export const sortProductsByStock = (order, data) => sortProductsBy('stock', order, data);
export const sortProductsByName = (order, data) => sortProductsBy('name', order, data);
export const sortProductsByPrice = (order, data) => sortProductsBy('unitPrice', order, data);
export const sortProductsByRating = (order, data) => sortProductsBy('rating', order, data);
export const sortProductsByDiscount = (order, data) => sortProductsBy('discount', order, data);
export const sortProductsByTimeListed = (order, data) => sortProductsBy('newProducts', order, data);
export const sortProductsByBrand = (order, data) => sortProductsBy('brand', order, data);
export const sortProductsByColor = (order, data) => sortProductsBy('color', order, data);
export const sortProductsBySupplier = (order, data) => sortProductsBy('supplier', order, data);
export const sortProductsByMaterial = (order, data) => sortProductsBy('material', order, data);
export const sortProductsByCapacity = (order, data) => sortProductsBy('capacity', order, data);
export const sortProductsByWarranty = (order, data) => sortProductsBy('warranty', order, data);
export const sortProductsByPopularity = (order, data) => sortProductsBy('popularity', order, data);

// Sales manager discount API calls
export const setDiscount = (id, data) => API.put(`/store/product/discount/${id}`, data);

// API call to get product image
export const getProductImage = (id) => API.get(`/store/product/${id}/image`, { responseType: 'blob' });

// Image API calls
export const uploadImage = (formData) => 
  API.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteImage = (imageName) => 
  API.delete(`/images/${imageName}`);

export const fetchImage = (imageName) => 
  API.get(`/images/${imageName}`, {
    responseType: 'blob'
  });

export const fetchAllImages = () => 
  API.get('/images');

// For category images specifically
export const uploadCategoryImage = (categoryId, formData) => 
  API.post(`/images/category/${categoryId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

// Export default API instance
export default API;
