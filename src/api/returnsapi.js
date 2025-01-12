import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Get all returns (Sales Manager only)
export const getAllReturns = () => API.get('/returns/all');

// Get specific return request by ID (Sales Manager only)
export const getReturnRequest = (id) => API.get(`/returns/request/${id}`);

// Get return request status
export const getReturnRequestStatus = (id) => API.get(`/returns/request/${id}/status`);

// Get refund approval request status
export const getRefundRequestStatus = (id) => API.get(`/returns/refund/${id}/status`);

// Create new return request (Customer only)
export const createReturnRequest = (data) => API.post('/returns/newrequest', data);

// Update return request
export const updateReturnRequest = (id, data) => API.put(`/returns/request/${id}`, data);

// Update return request status (Sales/Product Manager only)
export const updateReturnRequestStatus = (id, status) => 
    API.put(`/returns/request/${id}/status`, { status });

// Delete return request (Customer only)
export const deleteReturnRequest = (id) => API.delete(`/returns/request/${id}`);

// Authorize return payment (Sales Manager only)
export const authorizeReturnPayment = (id) => 
    API.post(`/returns/request/${id}/authorizepayment`);

// Get return cost
export const getReturnCost = (id) => API.get(`/returns/request/${id}/cost`);

// Get customer's return requests
export const getCustomerReturnRequests = (username) => 
    API.get(`/returns/request/customer/${username}`);

// Refund payment (Sales Manager only)
export const refundPayment = (id) => API.post(`/payment/refund/${id}`);

// Send refund approval notification email
export const sendRefundApprovalEmail = (requestId) => 
    API.post(`/returns/request/${requestId}/sendRefundNotifMail`);

export default API;

