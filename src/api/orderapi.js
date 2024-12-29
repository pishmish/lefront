import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// Order API calls
export const fetchOrder = (id) => API.get(`/order/getorder/${id}`); // Fetch a specific order by ID
export const fetchUserOrders = () => API.get('/order/user'); // Fetch all orders for a customer
export const fetchSupplierOrders = (username) => API.get(`/order/supplier/${username}`); // Fetch all orders for a supplier (product manager)
export const fetchPurchasePrice = (orderId, productId) => API.get(`/order/purchaseprice/${orderId}/${productId}`); // Fetch purchase price for a specific order and product
export const createOrder = (data) => API.post('/order/neworder', data); // Create a new order
export const updateOrder = (id, data) => API.put(`/order/updateorder/${id}`, data); // Update an existing order
export const cancelOrder = (id) => API.put(`/order/cancelorder/${id}`); // Cancel an order
export const updateOrderItems = (id, data) => API.put(`/order/orderitems/${id}`, data); // Update items in an order
export const deleteOrderItem = (orderId, productId) => API.delete(`/order/orderitems/${orderId}/${productId}`); // Delete an from an order

// Product Manager Order APIs
export const fetchAllOrders = () => API.get('/order/getallorders');

// Payment API calls
export const processPayment = (data) => API.post('/payment/process', data); // Process a payment

// Invoice API calls
export const mailInvoiceByIdtoEmail = (id, email) => API.get(`/invoice/mail/${id}/${email}`); // Fetch a specific invoice by ID
export const downloadInvoiceById = async (id) => {
    try {
        const response = await API.get(`/invoice/download/${id}`, {
            responseType: 'blob', // Important to handle binary files
        });

        // Create a download link for the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`); // Set file name
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download invoice:", error);
        throw error;
    }
};

export default API;
